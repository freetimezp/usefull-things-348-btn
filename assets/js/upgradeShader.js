import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js";

let scene, camera, renderer, material;
let mouse = new THREE.Vector2(0.5, 0.5);
let targetMouse = new THREE.Vector2(0.5, 0.5);

let initialized = false;

export function initUpgradeShader(clickX = 0.5, clickY = 0.5) {
    const canvas = document.getElementById("webgl");

    if (initialized) {
        material.uniforms.uMouse.value.set(clickX, clickY);

        gsap.to(material.uniforms.uProgress, {
            value: 1.2,
            duration: 1.2,
            ease: "power3.out",
        });

        return;
    }

    initialized = true;

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.domElement.style.mixBlendMode = "overlay";

    const geometry = new THREE.PlaneGeometry(2, 2);

    material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uMouse: { value: new THREE.Vector2(clickX, clickY) },
            uProgress: { value: 0 },
        },
        fragmentShader: `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec2 uMouse;
            uniform float uProgress;

            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution;

                float dist = distance(uv, uMouse);

                float ripple = sin(dist * 30.0 - uTime * 6.0) * 0.05;

                vec2 dir = normalize(uv - uMouse);
                float influence = smoothstep(0.6, 0.0, dist);
                uv += dir * ripple * influence;

                float portal = smoothstep(
                    uProgress + sin(uTime * 0.5) * 0.02,
                    uProgress - 0.2,
                    dist
                );

                vec3 base = vec3(0.01, 0.015, 0.02);
                vec3 accent = vec3(0.0, 0.7, 1.0);

                vec3 color = mix(base, accent, portal * 0.9);

                float cursor = distance(uv, uMouse);
                color += 0.05 * smoothstep(0.15, 0.0, cursor);

                float vignette = smoothstep(0.9, 0.3, length(uv - 0.5));
                color *= vignette;

                gl_FragColor = vec4(color, 1.0);
            }
        `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.render(scene, camera);
    animate();

    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    });

    window.addEventListener("mousemove", (e) => {
        targetMouse.x = e.clientX / window.innerWidth;
        targetMouse.y = 1.0 - e.clientY / window.innerHeight;
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (!material) return;

    material.uniforms.uTime.value += 0.02;

    mouse.lerp(targetMouse, 0.08);
    material.uniforms.uMouse.value = mouse;

    renderer.render(scene, camera);
}
