package request

type nameValuePair struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type Request struct {
	Method      string            `json:"method"`
	Headers     map[string]string `json:"headers"`
	Url         string            `json:"url"`
	Body        interface{}       `json:"body"`
	QueryParams []nameValuePair   `json:"queryParams"`
}
