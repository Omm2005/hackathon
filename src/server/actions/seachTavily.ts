'use server';

import { env } from "@/env";
import { tavily } from "@tavily/core";

type WebSearchType = {
  images:{
    url: string
    description: string
  }[]
  query: string
  results: {
    title: string
    url: string
    content: string
  }[]
}

export default async function websearch(query: string) {
  const client = await tavily({
    apiKey: env.TRAVILY_API_KEY,
  });
  const results = await client.search(query,{
    maxResults: 3,
    includeAnswer: true,
    includeImages: true,
    includeImageDescriptions: true,
    includeRawContent: true
  });

  const formattedResults: WebSearchType = {
    answer: results.answer || "No answer available",
    images: results.images.map((image) => ({
      url: image.url,
      description: image.description || "No description available"
    })),
    query: results.query,
    results: results.results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.content
    }))
  }

  console.log("Formatted Results: ", formattedResults);

  return formattedResults;
}