package request

type NameValuePair struct {
	Name    string `json:"name"`
	Value   string `json:"value"`
	Enabled bool   `json:"enabled"`
}

type MultipartFormdataVal struct {
	Value     string
	ValueType string
	Filename  string
	MimeType  string
}

type Request struct {
	Method           string            `json:"method"`
	Headers          []NameValuePair   `json:"headers"`
	FormattedHeaders map[string]string `json:"formattedHeaders"`
	Url              string            `json:"url"`
	Body             interface{}       `json:"body"`
	QueryParams      []NameValuePair   `json:"queryParams"`
}
