import * as THREE from 'three/webgpu'

export function projectNDCTo3D(x, y, camera, distance = undefined) {
    const vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(camera);

    const dir = vector.sub(camera.position).normalize(); // Direction from camera to point in NDC
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection); // Camera view direction

    // Distance to the plane perpendicular to the camera view direction
    if( !distance ) {
        distance = - camera.position.dot(cameraDirection) / dir.dot(cameraDirection);
    }


    // Point in 3D space
    return camera.position.clone().add(dir.multiplyScalar(distance));
}

export function calculateUVTransform( texture, sizes ) {
    const screenAspect = sizes.width / sizes.height;
    const imageAspect = texture.image.width / texture.image.height;

    const uvScale = new THREE.Vector2( 1, 1 );
    const uvOffset = new THREE.Vector2( 0, 0 );

    if ( screenAspect > imageAspect ) {
        // Screen is wider: image height is adjusted, UV is corrected by Y
        uvScale.y = imageAspect / screenAspect;
        uvOffset.y = ( 1 - uvScale.y ) / 2;
    } else {
        // Screen is taller: image width is adjusted, UV is corrected by X
        uvScale.x = screenAspect / imageAspect;
        uvOffset.x = ( 1 - uvScale.x ) / 2;
    }

    return { uvScale, uvOffset };
}
