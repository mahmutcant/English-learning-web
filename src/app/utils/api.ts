import axios from "axios";
import { SearchResult, WordDetail } from "../model/SearchModel";

const baseURL = process.env.NEXT_PUBLIC_SEARCH_API
const scrapeApiURL = process.env.NEXT_PUBLIC_SCRAPE_API
export const Search = async (word: string): Promise<SearchResult[]> => {
    try {
        const response = await axios.get(`${baseURL}/amp?dataset=english&q=${word}&__amp_source_origin=https%3A%2F%2Fdictionary.cambridge.org`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const MAX_RETRIES = 3;

const axiosInstance = axios.create({
    baseURL: scrapeApiURL,
    timeout: 120000,
});

axiosInstance.interceptors.response.use(null, async (error) => {
    const { config } = error;
    if (!config || !config.retry) {
        config.retry = 0;
    }
    
    config.retry += 1;
    
    if (config.retry <= MAX_RETRIES) {
        console.log(`Retrying request... (${config.retry}/${MAX_RETRIES})`);
        return axiosInstance(config);
    }
    
    return Promise.reject(error);
});

export const getInformationByWord = async (word: string): Promise<WordDetail> => {
    try {
        const response = await axiosInstance.get(word);
        return response.data;
    } catch (error) {
        throw error;
    }
};