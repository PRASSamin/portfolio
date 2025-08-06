/*
Copyright 2025 NAME HERE EMAIL ADDRESS
*/
package cmd

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

// genToolsCmd represents the genTools command
var genFontIconsCmd = &cobra.Command{
	Use:   "genFontIcons",
	Short: "Generate .yaml file from selection.json",
	Run: func(cmd *cobra.Command, args []string) {
		var err error;
		selectionJsonPath := filepath.Join("public", "icons", "selection.json")

		fontIconsYamlPath := filepath.Join("public", "icons", "data.yaml")
		if yamlPath := cmd.Flag("yamlPath").Value.String(); yamlPath != "" {
			fontIconsYamlPath, err = filepath.Abs(yamlPath)
			if err != nil {
				fontIconsYamlPath = filepath.Join("public", "icons", "data.yaml")
			}
		}

		fontIconsJsPath := filepath.Join("src", "constants", "icons.ts")
		if jsPath := cmd.Flag("jsPath").Value.String(); jsPath != "" {
			fontIconsJsPath, err = filepath.Abs(jsPath)
			if err != nil {
				fontIconsJsPath = filepath.Join("src", "constants", "icons.ts")
			}
		}

		if _, err := os.Stat(selectionJsonPath); os.IsNotExist(err) {
			fmt.Println("public/icons/selection.json not found")
			return
		}
		
		selectionJson, err := os.ReadFile(selectionJsonPath)
		if err != nil {
			fmt.Println("Error reading selection.json:", err)
			return
		}
		
		var data map[string]interface{}
		if err := json.Unmarshal(selectionJson, &data); err != nil {
			fmt.Println("Error unmarshalling selection.json:", err)
			return
		}

		fontIcons, ok := data["icons"].([]interface{})
		if !ok {
			fmt.Println("Invalid selection.json")
			return
		}

		var fontIconsData []map[string]interface{}
		for _, icon := range fontIcons {
			iconMap, ok := icon.(map[string]interface{})
			if !ok {
				continue
			}
			props, ok := iconMap["properties"].(map[string]interface{})
			if !ok {
				continue
			}

			name, _ := props["name"].(string)
			code, _ := props["code"].(float64)

			iconData := map[string]interface{}{
				"name":    name,
				"unicode": fmt.Sprintf("\\u{%x}", int(code)),
				"code":    int(code),
			}
			fontIconsData = append(fontIconsData, iconData)
		}

		// Create the final YAML structure
		yamlData := map[string]interface{}{
			"icons": fontIconsData,
		}

		// Convert to YAML
		yamlBytes, err := yaml.Marshal(yamlData)
		if err != nil {
			fmt.Println("Error marshaling YAML:", err)
			return
		}

		// Write to file
		err = os.WriteFile(fontIconsYamlPath, yamlBytes, 0644)
		if err != nil {
			fmt.Println("Error writing YAML file:", err)
			return
		}

		// Convert to JS
		jsBytes, err := json.MarshalIndent(fontIconsData, "", "  ")
		if err != nil {
			fmt.Println("Error marshaling JS:", err)
			return
		}

		jsBytesWithType := []byte("export type FontIconsData = {\n  name: string;\n  unicode: string;\n  code: number;\n};\nexport const FontIcons = " + string(jsBytes))

		// Write to file
		err = os.WriteFile(fontIconsJsPath, jsBytesWithType, 0644)
		if err != nil {
			fmt.Println("Error writing JS file:", err)
			return
		}

		fmt.Printf("Successfully generated %d icons\n", len(fontIconsData))
		fmt.Printf("YAML file: %s\n", fontIconsYamlPath)
		fmt.Printf("JS file: %s\n", fontIconsJsPath)
	},
}

func init() {
	genFontIconsCmd.Flags().StringP("jsPath", "j", "", "JS path")
	genFontIconsCmd.Flags().StringP("yamlPath", "y", "", "YAML path")
	rootCmd.AddCommand(genFontIconsCmd)
}
