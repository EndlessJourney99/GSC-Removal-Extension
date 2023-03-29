import useArticles from '../hooks/useArticle';

const ListArticles = () => {
    const { articles, error, isLoading } = useArticles();
    return (
        <div className="container">
            {isLoading ? (
                <div className="spinner">
                    <span className="spinner__circle" />
                    <span>Please wait...</span>
                </div>
            ) : error ? (
                <span className="error">{error}</span>
            ) : (
                <>
                    <h1 className="title">Top posts on DEV Community test 5</h1>
                    <ul className="articles">
                        {articles.map(
                            ({
                                id,
                                title,
                                url,
                                positive_reactions_count,
                                published_timestamp,
                                reading_time_minutes,
                            }) => (
                                <li key={id} className="article">
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="article__link"
                                    >
                                        {title}
                                    </a>
                                    <ul className="article__details">
                                        {[
                                            {
                                                title: 'Published at',
                                                icon: '🗓',
                                                label: 'Calendar emoji',
                                                value: new Date(
                                                    published_timestamp
                                                ).toLocaleDateString(),
                                            },
                                            {
                                                title: 'Reading time',
                                                icon: '🕑',
                                                label: 'Clock emoji',
                                                value: `${reading_time_minutes} min`,
                                            },
                                            {
                                                title: 'Reactions count',
                                                icon: '❤️ 🦄 🔖',
                                                label: 'Heart, unicorn and bookmark emojis',
                                                value: positive_reactions_count,
                                            },
                                        ].map(({ title, icon, label, value }, index) => (
                                            <li
                                                key={`${id}-detail-${index}`}
                                                className="article__detail"
                                                title={title}
                                            >
                                                <span role="img" aria-label={label}>
                                                    {icon}
                                                </span>
                                                <span>{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            )
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ListArticles;
