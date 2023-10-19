package initialize

import (
	"html/template"
	"io"

	"github.com/labstack/echo/v4"
)

// TemplateRenderer is a custom html/template renderer for Echo framework
type TemplateRenderer struct {
	templates *template.Template
}

// Render renders a template document
func (t *TemplateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

func InitTemplateRenderer(e *echo.Echo) {
	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseGlob("web/templates/*.html")),
	}
	e.Renderer = renderer
}
