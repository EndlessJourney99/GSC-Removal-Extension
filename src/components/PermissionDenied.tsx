const PermissionDenied = () => {
    return (
        <div className="flex flex-wrap items-center justify-center font-bold text-lg text-red-500 h-56">
            {/* <span className="spinner__circle" /> */}
            <span className="col-span-full">This extension only work in "example" site.</span>
            <small className="text-slate-600 text-ellipsis">Please open "example" to start using extension!</small>
        </div>
    );
};

export default PermissionDenied;
