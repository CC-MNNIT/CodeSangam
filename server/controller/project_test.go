package controller

import "testing"

func TestCSVSafeCell(t *testing.T) {
	for _, value := range []string{"=HYPERLINK(\"https://example.test\")", "+CMD", "-1+2", "@SUM(A1)", "  =1+2", "\t=1+2", "\r=1+2", "\n@CMD"} {
		if got := csvSafeCell(value); got != "'"+value {
			t.Errorf("unsafe cell %q was not escaped: %q", value, got)
		}
	}
	for _, value := range []string{"", "PixelForge", "D&M Novas", "Syntax scholars", "RAIDEN々REGIME"} {
		if got := csvSafeCell(value); got != value {
			t.Errorf("ordinary name changed from %q to %q", value, got)
		}
	}
}
