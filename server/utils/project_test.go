package utils

import (
	"errors"
	"strings"
	"testing"
)

const demoFileID = "1DEMO_VideoId_1234567890"

func TestNormaliseProjectLinks(t *testing.T) {
	video := "https://drive.google.com/file/d/" + demoFileID + "/view"
	for _, tc := range []struct {
		name, github, drive, wantGithub, wantDrive string
	}{
		{"plain links", "https://github.com/acme/project", video, "https://github.com/acme/project", video},
		{"trim and scheme", "  github.com/acme/project/  ", " drive.google.com/file/d/" + demoFileID + "/view?usp=sharing ", "https://github.com/acme/project", video},
		{"www and http", "http://WWW.GITHUB.COM/acme/project", "http://drive.google.com/file/d/" + demoFileID, "https://github.com/acme/project", video},
		{"repo from README", "https://github.com/acme/project/blob/main/README.md#intro", video, "https://github.com/acme/project", video},
		{"git clone address", "https://github.com/acme/project.git", video, "https://github.com/acme/project", video},
		{"protocol relative", "//github.com/acme/project", "//drive.google.com/open?id=" + demoFileID, "https://github.com/acme/project", video},
		{"Drive download address", "https://github.com/acme/project", "https://drive.google.com/uc?export=download&id=" + demoFileID, "https://github.com/acme/project", video},
		{"Drive account path", "https://github.com/acme/project", "https://drive.google.com/file/u/0/d/" + demoFileID + "/preview", "https://github.com/acme/project", video},
		{"resource key survives", "https://github.com/acme/project", video + "?usp=sharing&resourcekey=0-AbCd_Ef", "https://github.com/acme/project", video + "?resourcekey=0-AbCd_Ef"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			github, drive, err := NormaliseProjectLinks(tc.github, tc.drive)
			if err != nil {
				t.Fatal(err)
			}
			if github != tc.wantGithub || drive != tc.wantDrive {
				t.Fatalf("got %q, %q; want %q, %q", github, drive, tc.wantGithub, tc.wantDrive)
			}
		})
	}
}

func TestProjectLinksRejectInvalidInputs(t *testing.T) {
	github := "https://github.com/acme/project"
	video := "https://drive.google.com/file/d/" + demoFileID + "/view"
	for _, tc := range []struct {
		name, github, video, field string
	}{
		{"repo required", "", video, "github_url"},
		{"video required", github, "", "video_url"},
		{"profile is not repo", "https://github.com/acme", video, "github_url"},
		{"site route is not repo", "https://github.com/features/actions", video, "github_url"},
		{"bad owner", "https://github.com/-acme/project", video, "github_url"},
		{"path traversal", "https://github.com/acme/../login", video, "github_url"},
		{"host spoof", "https://github.com.attacker.test/acme/project", video, "github_url"},
		{"credentials", "https://github.com@attacker.test/acme/project", video, "github_url"},
		{"credentials on allowed host", "https://user:password@github.com/acme/project", video, "github_url"},
		{"custom port", "https://github.com:8443/acme/project", video, "github_url"},
		{"javascript", "javascript:alert(1)", video, "github_url"},
		{"data URL", "data:text/html,<script>alert(1)</script>", video, "github_url"},
		{"non-http scheme", "ftp://github.com/acme/project", video, "github_url"},
		{"internal whitespace", "https://github.com/acme/my project", video, "github_url"},
		{"newline", "https://github.com/acme/\nproject", video, "github_url"},
		{"too long", github + "#" + strings.Repeat("a", MaxProjectLinkLength), video, "github_url"},
		{"malformed query", github + "?bad=%ZZ", video, "github_url"},
		{"Drive folder", github, "https://drive.google.com/drive/folders/" + demoFileID, "video_url"},
		{"Drive homepage", github, "https://drive.google.com/", "video_url"},
		{"missing file id", github, "https://drive.google.com/file/d//view", "video_url"},
		{"fake Drive path", github, "https://drive.google.com/evil/d/" + demoFileID, "video_url"},
		{"short file id", github, "https://drive.google.com/file/d/x/view", "video_url"},
		{"YouTube", github, "https://youtu.be/demo", "video_url"},
		{"Google Docs", github, "https://docs.google.com/document/d/" + demoFileID + "/edit", "video_url"},
		{"video host spoof", github, "https://drive.google.com.attacker.test/file/d/" + demoFileID + "/view", "video_url"},
		{"malformed resource key", github, video + "?resourcekey=%3Cscript%3E", "video_url"},
		{"too long video", github, video + "?padding=" + strings.Repeat("a", MaxProjectLinkLength), "video_url"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			g, v, err := NormaliseProjectLinks(tc.github, tc.video)
			var linkErr *ProjectLinkError
			if !errors.As(err, &linkErr) || linkErr.Field != tc.field {
				t.Fatalf("expected %s error, got %v", tc.field, err)
			}
			if g != "" || v != "" {
				t.Fatal("a rejected pair must not return any link for saving")
			}
		})
	}
}
