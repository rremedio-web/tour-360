import { useEffect, useRef } from "react";

const PanoramaViewer = () => {
    const containerRef = useRef(null)
    useEffect(() => {
        console.log("start")
        return () => {
            console.log("stop")
        };
    }, []);

    return (
        <div className="panorama-viewer" ref={containerRef}>
        </div >
    );
};

export default PanoramaViewer;