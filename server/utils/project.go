package utils

import (
	"fmt"
	"net/url"
	"regexp"
	"strings"
	"unicode"
)

// MaxProjectLinkLength caps what we store. Real GitHub and Drive links are far
// shorter; the limit exists so a pasted essay can't fill a row.
const MaxProjectLinkLength = 500

type ProjectLinkError struct {
	Field   string
	Message string
}

func (e *ProjectLinkError) Error() string { return e.Message }

var (
	githubOwner = regexp.MustCompile(`^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$`)
	githubRepo  = regexp.MustCompile(`^[A-Za-z0-9_.-]{1,100}$`)
	driveFile   = regexp.MustCompile(`^/file/(?:u/[0-9]+/)?d/([A-Za-z0-9_-]{10,200})(?:/(?:view|preview))?/?$`)
	driveID     = regexp.MustCompile(`^[A-Za-z0-9_-]{10,200}$`)
	resourceKey = regexp.MustCompile(`^[A-Za-z0-9_-]{1,200}$`)
)

func linkError(field string, message string) error {
	return &ProjectLinkError{Field: field, Message: message}
}

// NormaliseProjectLinks cleans and checks a team's final submission: a GitHub
// repository link and a Google Drive link to a short demo video. Both are
// required. It returns the links in the form they should be stored, or a
// message written for the person who typed them.
func NormaliseProjectLinks(githubRaw string, videoRaw string) (string, string, error) {
	github, err := normaliseLink(githubRaw)
	if err != nil {
		return "", "", linkError("github_url", "Paste a GitHub repository link, such as github.com/your-team/project (up to 500 characters).")
	}
	if host(github) != "github.com" {
		return "", "", linkError("github_url", "The repository link must be on github.com.")
	}
	segments := strings.Split(strings.Trim(github.Path, "/"), "/")
	if !looksLikeRepo(segments) {
		return "", "", linkError("github_url", "Use a repository link, not a GitHub profile. It should look like github.com/owner/project.")
	}
	// Links copied from a branch or README still identify the same repository.
	// Store its root so viewers cannot land on an unrelated GitHub route.
	github.Host = "github.com"
	github.Path = "/" + segments[0] + "/" + strings.TrimSuffix(segments[1], ".git")
	github.RawPath = ""
	github.RawQuery = ""
	github.ForceQuery = false

	video, err := normaliseLink(videoRaw)
	if err != nil {
		return "", "", linkError("video_url", "Paste the Google Drive file link to your demo video (up to 500 characters).")
	}
	if host(video) != "drive.google.com" {
		return "", "", linkError("video_url", "The video link must be on drive.google.com. YouTube and Google Docs links are not accepted.")
	}
	id := ""
	if match := driveFile.FindStringSubmatch(video.Path); match != nil {
		id = match[1]
	} else if video.Path == "/open" || video.Path == "/uc" {
		id = video.Query().Get("id")
	}
	if !driveID.MatchString(id) {
		return "", "", linkError("video_url", "Use the video's file link, not a Drive folder. Open the video, choose Share, then Copy link.")
	}
	query := url.Values{}
	// Some shared Drive files need a resource key; dropping it breaks access.
	if key := video.Query().Get("resourcekey"); key != "" {
		if !resourceKey.MatchString(key) {
			return "", "", linkError("video_url", "The Drive sharing link is malformed. Copy it again from the video's Share dialog.")
		}
		query.Set("resourcekey", key)
	}
	video.Host = "drive.google.com"
	video.Path = "/file/d/" + id + "/view"
	video.RawPath = ""
	video.RawQuery = query.Encode()
	video.ForceQuery = false

	return github.String(), video.String(), nil
}

// normaliseLink trims a pasted link, adds https:// when the scheme is missing,
// and refuses anything that is not plain http(s). Rejecting on the scheme,
// rather than only checking the host, is what keeps javascript: and data:
// links out of the page.
func normaliseLink(raw string) (*url.URL, error) {
	link := strings.TrimSpace(raw)
	if link == "" {
		return nil, fmt.Errorf("empty link")
	}
	if len(link) > MaxProjectLinkLength {
		return nil, fmt.Errorf("link is too long")
	}
	if strings.IndexFunc(link, func(r rune) bool { return unicode.IsControl(r) || unicode.IsSpace(r) }) >= 0 {
		return nil, fmt.Errorf("link contains whitespace or control characters")
	}
	// "github.com/x/y" is what people copy out of a chat; parse it as https.
	if strings.HasPrefix(link, "//") {
		link = "https:" + link
	} else if !strings.Contains(link, "://") {
		link = "https://" + link
	}
	parsed, err := url.Parse(link)
	if err != nil {
		return nil, err
	}
	// User info would let a link read as one site while pointing at another.
	if parsed.Host == "" || parsed.User != nil || parsed.Opaque != "" || parsed.Port() != "" {
		return nil, fmt.Errorf("link must have a host without credentials or a custom port")
	}
	switch strings.ToLower(parsed.Scheme) {
	case "http", "https":
	default:
		return nil, fmt.Errorf("only http and https links are accepted")
	}
	if _, err := url.ParseQuery(parsed.RawQuery); err != nil {
		return nil, err
	}
	parsed.Scheme = "https"
	parsed.Host = strings.ToLower(parsed.Host)
	parsed.Fragment = ""
	parsed.RawFragment = ""
	return parsed, nil
}

// host returns the link's host without a leading www.
func host(link *url.URL) string {
	return strings.TrimPrefix(strings.ToLower(link.Hostname()), "www.")
}

func looksLikeRepo(segments []string) bool {
	if len(segments) < 2 || !githubOwner.MatchString(segments[0]) {
		return false
	}
	repo := strings.TrimSuffix(segments[1], ".git")
	if !githubRepo.MatchString(repo) || repo == "." || repo == ".." {
		return false
	}
	// These are GitHub site navigation, not owner/repository paths.
	switch strings.ToLower(segments[0]) {
	case "about", "collections", "customer-stories", "enterprise", "events", "explore", "features", "login", "marketplace", "orgs", "pricing", "readme", "search", "security", "settings", "signup", "sponsors", "topics", "users":
		return false
	}
	return true
}
