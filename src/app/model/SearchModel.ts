export interface SearchResult{
    word: string,
    url: string,
}

export interface WordDetail {
    example_sentences: string[],
    level: string,
    synonyms: string[]
    title: string,
    turkish_means: string[]
}

export interface HistoryWordDetail {
    [title: string]: WordDetail,
}