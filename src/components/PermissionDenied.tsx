const PermissionDenied = (props: { manifest: any }) => {
    return (
        <div className="flex flex-wrap items-center content-center justify-center font-bold text-lg text-red-500 h-56">
            {/* <span className="spinner__circle" /> */}
            <span className="col-span-full text-center">
                This extension only work in{' '}
                {props.manifest.value?.host_permissions[0]}.
            </span>
            <small className="text-slate-600 text-ellipsis">
                Please open{' '}
                <a
                    href={props.manifest.value?.host_permissions[0]}
                    target="_blank"
                >
                    {props.manifest.value?.host_permissions[0]}
                </a>{' '}
                to start using extension!
            </small>
        </div>
    );
};

export default PermissionDenied;
