import { html } from "@codemirror/lang-html"
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { yaml } from "@codemirror/lang-yaml"

export function getCodeMirrorLangSupport(lang: string) {
	switch (lang) {
		case "javascript":
			return javascript()
		case "html":
			return html()
		case "yaml":
		case "yml":
			return yaml()
		case "json":
		default:
			return json()
	}
}
