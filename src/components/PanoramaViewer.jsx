import { useEffect, useRef } from "react";
import { Scene, Color, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshBasicMaterial, SRGBColorSpace, Mesh, TextureLoader, SpriteMaterial, Sprite, Raycaster, Vector2 } from "three"
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

const PanoramaViewer = ({ image, hotspots, onHotspotClick }) => {

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


        const raycaster = new Raycaster()

        let downX, downY
        renderer.domElement.addEventListener("pointerdown", rememberDown)

        function rememberDown(event) {
            downX = event.clientX
            downY = event.clientY
        }

        function handleMarkerClick(event) {
            if (Math.hypot(event.clientX - downX, event.clientY - downY) > 6) return
            const box = renderer.domElement.getBoundingClientRect()
            const pointer = new Vector2(
                ((event.clientX - box.left) / box.width) * 2 - 1,
                -((event.clientY - box.top) / box.height) * 2 + 1,
            )
            raycaster.setFromCamera(pointer, camera)
            const hit = raycaster.intersectObjects(markers)[0]
            if (hit) {
                const hotspot = hit.object.userData.hotspot
                onHotspotClick(hotspot.id, hotspot.targetRoomId, event)
            }
        }

        renderer.domElement.addEventListener("click", handleMarkerClick)



        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = false
        controls.enablePan = false
        controls.rotateSpeed = -0.25


        const infoTexture = new TextureLoader().load("/markers/info.png")
        infoTexture.colorSpace = SRGBColorSpace
        const linkTexture = new TextureLoader().load("/markers/link.png")
        linkTexture.colorSpace = SRGBColorSpace
        const infoMaterial = new SpriteMaterial({ map: infoTexture })
        const linkMaterial = new SpriteMaterial({ map: linkTexture })
        const markers = []
        hotspots.forEach((hotspot) => {
            const marker = new Sprite(hotspot.type === "info" ? infoMaterial : linkMaterial)
            marker.userData.hotspot = hotspot
            markers.push(marker)
            marker.position.copy(yawPitchToPoint(hotspot.yaw, hotspot.pitch))
            marker.scale.set(20, 20, 1)
            scene.add(marker)
        })



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
            infoTexture.dispose()
            linkTexture.dispose()
            linkMaterial.dispose()
            infoMaterial.dispose()
            cancelAnimationFrame(frameId)
            observer.disconnect()
            renderer.domElement.removeEventListener("click", handleMarkerClick)
            renderer.domElement.removeEventListener("pointerdown", rememberDown)

        };
    }, [image, hotspots]);

    return (
        <div className="panorama-viewer" ref={containerRef}>
        </div >
    );
};

export default PanoramaViewer;