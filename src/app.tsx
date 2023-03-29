import { Suspense, lazy } from 'preact/compat';
import PermissionDenied from './components/PermissionDenied';
import useChrome from './hooks/useChrome';
import { compareHost } from './utils/GlobalUtils';

const ListArticles = lazy(() => import('./components/ListArticles'));

export const App = () => {
    const { tabInfo, manifest } = useChrome();
    return (
        <Suspense fallback={<PermissionDenied />}>
            <div className="container mx-auto">
                {manifest &&
                tabInfo &&
                compareHost(manifest.host_permissions, tabInfo.url ?? '') ? (
                    <ListArticles />
                ) : (
                    <PermissionDenied />
                )}
            </div>
        </Suspense>
    );
};
