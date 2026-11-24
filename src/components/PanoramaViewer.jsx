import { useEffect, useRef } from "react";
import { Scene, Color, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshBasicMaterial, SRGBColorSpace, Mesh, TextureLoader, SpriteMaterial, Sprite } from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { MathUtils, Vector3 } from "three"
function yawPitchToPoint(yaw, pitch, radius = 400) {
    const yawRad = MathUtils.degToRad(yaw)
    const pitchRad = MathUtils.degToRad(pitch)
    return new Vector3(
        radius * Math.cos(pitchRad) * Math.sin(yawRad),
        radius * Math.sin(pitchRad),
        -radius * Math.cos(pitchRad) * Math.cos(yawRad),
    )
}

const PanoramaViewer = ({ image }) => {

    const containerRef = useRef(null)
    useEffect(() => {
        const scene = new Scene();
        scene.background = new Color("#1a2b3c");
        const geometry = new SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1)

        const camera = new PerspectiveCamera(75,
            containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        const renderer = new WebGLRenderer();
        const texture = new TextureLoader().load(image, () => {
        })
        texture.colorSpace = SRGBColorSpace
        const material = new MeshBasicMaterial({ map: texture })
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        containerRef.current.appendChild(renderer.domElement);
        camera.position.z = 0.01
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = false
        controls.enablePan = false
        controls.rotateSpeed = -0.25
        const markerTexture = new TextureLoader().load("/markers/info.png")
        markerTexture.colorSpace = SRGBColorSpace
        const markerMaterial = new SpriteMaterial({ map: markerTexture })
        const marker = new Sprite(markerMaterial)
        marker.position.copy(yawPitchToPoint(0, 0, 100))
        marker.scale.set(5, 5, 1)
        scene.add(marker)
        let frameId
        function tick() {
            renderer.render(scene, camera)
            frameId = requestAnimationFrame(tick)
        }
        tick()
        const observer = new ResizeObserver(() => {
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)

        })

        observer.observe(containerRef.current)
        return () => {
            renderer.domElement.remove()
            renderer.dispose()
            geometry.dispose()
            material.dispose()
            texture.dispose()
            controls.dispose()
            markerTexture.dispose()
            markerMaterial.dispose()
            cancelAnimationFrame(frameId)
            observer.disconnect()
        };
    }, [image]);

    return (
        <div className="panorama-viewer" ref={containerRef}>
        </div >
    );
};

export default PanoramaViewer;