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

const PanoramaViewer = ({ image, hotspots, onHotspotClick, openHotspotId }) => {

    const containerRef = useRef(null)
    const sceneRef = useRef(null)
    const cameraRef = useRef(null)
    const rendererRef = useRef(null)


    useEffect(() => {

        const scene = new Scene();
        sceneRef.current = scene
        scene.background = new Color("#1a2b3c");

        const camera = new PerspectiveCamera(75,
            containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        cameraRef.current = camera
        const renderer = new WebGLRenderer();
        rendererRef.current = renderer
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        containerRef.current.appendChild(renderer.domElement);
        camera.position.z = 0.01





        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = false
        controls.enablePan = false
        controls.rotateSpeed = -0.25

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

            controls.dispose()

            cancelAnimationFrame(frameId)
            observer.disconnect()


        };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current

        const geometry = new SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1)

        const texture = new TextureLoader().load(image, () => {
        })
        texture.colorSpace = SRGBColorSpace

        const material = new MeshBasicMaterial({ map: texture })
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);


        return () => {
            geometry.dispose()
            texture.dispose()
            material.dispose()
            scene.remove(mesh)

        };
    }, [image]);


    useEffect(() => {
        const scene = sceneRef.current
        const camera = cameraRef.current
        const renderer = rendererRef.current

        const infoTexture = new TextureLoader().load("/markers/info.png")
        infoTexture.colorSpace = SRGBColorSpace
        const linkTexture = new TextureLoader().load("/markers/link.png")
        linkTexture.colorSpace = SRGBColorSpace
        const infoOpenTexture = new TextureLoader().load("/markers/info-open.png")
        infoOpenTexture.colorSpace = SRGBColorSpace
        const infoOpenMaterial = new SpriteMaterial({ map: infoOpenTexture })
        const infoMaterial = new SpriteMaterial({ map: infoTexture })
        const linkMaterial = new SpriteMaterial({ map: linkTexture })

        const markers = []
        hotspots.forEach((hotspot) => {
            const marker = new Sprite(hotspot.type === "info" ? openHotspotId === hotspot.id ? infoOpenMaterial : infoMaterial : linkMaterial)
            marker.userData.hotspot = hotspot
            markers.push(marker)
            marker.position.copy(yawPitchToPoint(hotspot.yaw, hotspot.pitch))
            marker.scale.set(20, 20, 1)
            scene.add(marker)
        })
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

        return () => {

            infoTexture.dispose()
            linkTexture.dispose()
            linkMaterial.dispose()
            infoMaterial.dispose()
            infoOpenTexture.dispose()
            infoOpenMaterial.dispose()
            renderer.domElement.removeEventListener("click", handleMarkerClick)
            renderer.domElement.removeEventListener("pointerdown", rememberDown)
            scene.remove(...markers)

        }


    }, [hotspots, onHotspotClick, openHotspotId]);

    return (
        <div className="panorama-viewer" ref={containerRef}>
        </div >
    );
};

export default PanoramaViewer;