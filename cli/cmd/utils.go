package cmd

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"

	"github.com/AlecAivazis/survey/v2"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/ktr0731/go-fuzzyfinder"
	"gopkg.in/yaml.v3"
)

type item struct {
	Display string
	Path    string
	IsDir   bool
	Locked  bool
}

type toolDef struct {
	Name    string `yaml:"name"`
	Unicode string `yaml:"unicode"`
	Code    int    `yaml:"code"`
}

type toolsFile struct {
	Tools []toolDef `yaml:"tools"`
}

// getContentDir reads the fumadocs config and extracts the content directory for a given collection.
func getContentDir(collectionName string) (string, error) {
	content, err := os.ReadFile("source.config.ts")
	if err != nil {
		return "", fmt.Errorf("read fumadocs config: %w", err)
	}

	// Regex to find `dir: "..."` inside `defineDocs` or `defineCollections`
	re := regexp.MustCompile(fmt.Sprintf(`const %s = define(?:Docs|Collections)\({[^}]*dir: "([^"]+)"`, collectionName))
	matches := re.FindStringSubmatch(string(content))

	if len(matches) < 2 {
		return "", fmt.Errorf("could not find content directory for '%s' in fumadocs config", collectionName)
	}

	return matches[1], nil
}

// writeMDX builds and writes the MDX file with frontmatter.
func writeProjectMDX(frontmatter map[string]any, slug, outputDir, title, description string) error {
	ym, err := yaml.Marshal(frontmatter)
	if err != nil {
		return fmt.Errorf("marshal frontmatter: %w", err)
	}

	// Build MDX content
	mdx := strings.Builder{}
	mdx.WriteString("---\n")
	mdx.Write(ym)
	mdx.WriteString("---\n\n")
	// Placeholder body
	mdx.WriteString(fmt.Sprintf("## %s\n\n%s\n", title, description))

	// Ensure output directory exists
	if err := os.MkdirAll(outputDir, 0o755); err != nil {
		return fmt.Errorf("mkdir output dir: %w", err)
	}

	// Derive filename from slug
	filename := fmt.Sprintf("%s.mdx", slug)
	outPath := filepath.Join(outputDir, filename)

	if err := os.WriteFile(outPath, []byte(mdx.String()), 0o644); err != nil {
		return fmt.Errorf("write mdx file: %w", err)
	}

	return nil
}

func loadTools(path string) ([]string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var tf toolsFile
	if err := yaml.Unmarshal(data, &tf); err != nil {
		return nil, err
	}

	names := make([]string, 0, len(tf.Tools))
	for _, t := range tf.Tools {
		names = append(names, t.Name)
	}
	return names, nil
}

func uploadImage(filePath string, name string, folder string) (*uploader.UploadResult, error) {
	cld, err := cloudinary.New()
	if err != nil {
		return nil, err
	}

	ctx := context.Background()
	return cld.Upload.Upload(ctx, filePath, uploader.UploadParams{
		PublicID:       name,
		Folder:         "pras/portfolio/" + folder,
		UniqueFilename: api.Bool(false),
		Overwrite:      api.Bool(true),
	})
}

func listDir(current string) ([]item, error) {
	entries, err := os.ReadDir(current)
	if err != nil {
		return nil, err
	}
	var dirs, files []item

	// parent entry if not root-ish
	if parent := filepath.Dir(current); parent != current {
		dirs = append(dirs, item{
			Display: "..",
			Path:    parent,
			IsDir:   true,
			Locked:  false,
		})
	}

	for _, e := range entries {
		name := e.Name()
		full := filepath.Join(current, name)
		isDir := e.IsDir()
		if !isDir && !IsImage(full) {
			continue
		}

		locked := false
		if isDir {
			// try reading to detect permission issues early
			if _, err := os.ReadDir(full); err != nil {
				locked = true
			}
		}

		display := name
		if isDir {
			display += "/"
		}
		if locked {
			display += " "
		}

		it := item{
			Display: display,
			Path:    full,
			IsDir:   isDir,
			Locked:  locked,
		}
		if isDir {
			dirs = append(dirs, it)
		} else {
			files = append(files, it)
		}
	}

	// sort for deterministic order
	sort.Slice(dirs, func(i, j int) bool { return dirs[i].Display < dirs[j].Display })
	sort.Slice(files, func(i, j int) bool { return files[i].Display < files[j].Display })

	return append(dirs, files...), nil
}

func askFile(startPath string) (string, error) {
	current, err := filepath.Abs(startPath)
	if err != nil {
		return "", fmt.Errorf("resolve start path: %w", err)
	}

	for {
		items, err := listDir(current)
		if err != nil {
			// If we can't list current, fallback to parent
			fmt.Printf("Warning: cannot read %s: %v\n", current, err)
			parent := filepath.Dir(current)
			if parent == current {
				return "", fmt.Errorf("cannot read root and no fallback: %w", err)
			}
			current = parent
			continue
		}

		// Build display slice and inject a manual path jump option
		displayList := make([]string, 0, len(items)+2)
		for _, it := range items {
			displayList = append(displayList, it.Display)
		}
		displayList = append(displayList, "[Go to / (root)]")
		displayList = append(displayList, "[Go to ~ (home)]")

		idx, err := fuzzyfinder.Find(
			displayList,
			func(i int) string { return displayList[i] },
			fuzzyfinder.WithPromptString(fmt.Sprintf("Browse: %s > ", current)),
			fuzzyfinder.WithPreviewWindow(func(i, w, h int) string {
				// Only preview if the item is a file and image
				if i < 0 || i >= len(displayList) {
					return ""
				}
				selection := displayList[i]
				// find matched item
				var matched *item
				for _, it := range items {
					if it.Display == selection {
						matched = &it
						break
					}
				}
				if matched == nil || matched.IsDir {
					return ""
				}
				if !IsImage(matched.Path) {
					return ""
				}
				thumb, err := RenderThumbnail(matched.Path, 40, 12)
				if err != nil {
					return fmt.Sprintf("preview error: %v", err)
				}
				return thumb
			}),
		)
		
		if err != nil {
			if err == fuzzyfinder.ErrAbort {
				return "", errors.New("user aborted browsing")
			}
			return "", fmt.Errorf("fuzzyfinder error: %w", err)
		}

		selection := displayList[idx]

		switch selection {
		case "[Go to / (root)]":
			current = "/"
			continue
		case "[Go to ~ (home)]":
			current = os.Getenv("HOME")
			continue
		default:
			// match to items
			var matched *item
			for _, it := range items {
				if it.Display == selection {
					matched = &it
					break
				}
			}
			if matched == nil {
				// shouldn't happen
				continue
			}
			if matched.IsDir {
				if matched.Locked {
					fmt.Printf("Cannot enter %s (permission denied)\n", matched.Path)
					continue
				}
				current = matched.Path
				continue
			}
			// file: confirm
			ok := false
			confirmPrompt := &survey.Confirm{
				Message: fmt.Sprintf("Select file %s?", matched.Path),
				Default: true,
			}
			if err := survey.AskOne(confirmPrompt, &ok); err != nil {
				return "", err
			}
			if ok {
				return matched.Path, nil
			}
			continue
		}
	}
}

func IsImage(path string) bool {
	ext := filepath.Ext(path)
	switch ext {
	case ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff":
		return true
	default:
		return false
	}
}

func getImageSize(path string) (int, int, error) {
	f, err := os.Open(path)
	if err != nil {
		return 0, 0, err
	}
	defer f.Close()
	cfg, _, err := image.DecodeConfig(f)
	if err != nil {
		return 0, 0, err
	}
	return cfg.Width, cfg.Height, nil
}

// fitToCells computes the best width and height in terminal cells for an image, preserving aspect ratio.
// maxCellsW, maxCellsH: max available space in characters
// cellAspect: width/height ratio of one character cell, e.g. 0.5 means width is half height
func fitToCells(imgW, imgH, maxCellsW, maxCellsH int, cellAspect float64) (int, int) {
	// Real aspect ratio of image
	imgAspect := float64(imgW) / float64(imgH)

	// Adjust image aspect by cell aspect ratio
	adjAspect := imgAspect / cellAspect

	// Aspect ratio of bounding box
	boxAspect := float64(maxCellsW) / float64(maxCellsH)

	if adjAspect > boxAspect {
		// Limited by width
		targetW := maxCellsW
		targetH := int(float64(maxCellsW) / adjAspect)
		if targetH < 1 {
			targetH = 1
		}
		return targetW, targetH
	} else {
		// Limited by height
		targetH := maxCellsH
		targetW := int(float64(maxCellsH) * adjAspect)
		if targetW < 1 {
			targetW = 1
		}
		return targetW, targetH
	}
}

var thumbCache = struct {
	path      string
	output    string
	timestamp time.Time
}{}

func isViuAvailable() bool {
	_, err := exec.LookPath("viu")
	return err == nil
}

func RenderThumbnail(path string, width, height int) (string, error) {
	if thumbCache.path == path && time.Since(thumbCache.timestamp) < 500*time.Millisecond {
		return thumbCache.output, nil
	}
	
	var thumb string
	
	if isViuAvailable() {
		imgW, imgH, err := getImageSize(path)
		if err != nil {
			return "", err
		}
		if IsImage(path) {
			w, h := fitToCells(imgW, imgH, 60, 30, 0.5)
			thumb, _ = renderWithViu(path, w, h)
		}
	} else {
		fmt.Println("viu not available or not an image")
	}

	thumbCache.path = path
	thumbCache.output = thumb
	thumbCache.timestamp = time.Now()
	return thumb, nil
}

func renderWithViu(path string, width, height int) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 400*time.Millisecond)
	defer cancel()

	cmd := exec.CommandContext(ctx, "viu", "-w", fmt.Sprintf("%d", width), "-h", fmt.Sprintf("%d", height), path)
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("viu failed: %w (%s)", err, out.String())
	}
	return out.String(), nil
}

func listContentFiles(dir string) ([]string, error) {
	var files []string
	items, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	for _, item := range items {
		if !item.IsDir() && strings.HasSuffix(item.Name(), ".mdx") {
			files = append(files, item.Name())
		}
	}
	return files, nil
}

func readFrontmatter(path string) (map[string]any, string, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return nil, "", err
	}

	parts := strings.SplitN(string(content), "---", 3)
	if len(parts) < 3 {
		return nil, "", fmt.Errorf("invalid mdx file format")
	}

	var frontmatter map[string]any
	if err := yaml.Unmarshal([]byte(parts[1]), &frontmatter); err != nil {
		return nil, "", err
	}

	return frontmatter, parts[2], nil
}

func getStringFromMap(m map[string]any, key, defaultValue string) string {
    if val, ok := m[key]; ok && val != nil {
        if str, ok := val.(string); ok {
            return str
        }
    }
    return defaultValue
}

func getStringFromNestedMap(m map[string]any, parentKey, childKey, defaultValue string) string {
    if parent, ok := m[parentKey]; ok {
        if parentMap, ok := parent.(map[string]any); ok {
            if val, ok := parentMap[childKey]; ok && val != nil {
                if str, ok := val.(string); ok {
                    return str
                }
            }
        }
    }
    return defaultValue
}