import { useEffect, useState } from "preact/hooks";
import Article from "../types/article";

const useArticles = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [error, setError] = useState("");
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const response = await fetch("https://dev.to/api/articles?top=1");

				if (!response.ok) {
					throw new Error("Response is not ok");
				}

				const data = await response.json();
				setArticles(data);
			} catch (error) {
				setError("An error ocurred while fetching articles");
			} finally {
				setLoading(false);
			}
		};

		fetchArticles();
	}, []);

	return { articles, error, isLoading };
};

export default useArticles;
