type PreloaderProps = {
    show: boolean;
};

const PreLoaderCircle = (props: PreloaderProps) => {
    const { show } = props;
    return (
        <div style={{ display: show ? 'inline-block' : 'none' }} className="preloader-wrapper small active">
            <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                    <div className="circle" />
                </div>
                <div className="gap-patch">
                    <div className="circle" />
                </div>
                <div className="circle-clipper right">
                    <div className="circle" />
                </div>
            </div>
        </div>
    );
};

export default PreLoaderCircle;
