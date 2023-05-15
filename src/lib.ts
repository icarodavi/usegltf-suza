import { BufferAttribute, Vector3 } from 'three'
import { TransformFn } from './SurfaceSampler'

export const computeUpness = (geometry) => {
  const { array, count } = geometry.attributes.normal
  const arr = Float32Array.from({ length: count })

  const normalVector = new Vector3()
  const up = new Vector3(0, 1, 0)

  for (let i = 0; i < count; i++) {
    const n = array.slice(i * 3, i * 3 + 3)
    normalVector.set(n[0], n[1], n[2])

    const value = normalVector.dot(up) > 0.4
    arr[i] = Number(value)
  }

  return new BufferAttribute(arr, 1)
}

export const transformInstance: TransformFn = ({ dummy, sampledMesh, position, normal }) => {
  dummy.scale.setScalar(Math.random() * 0.1)

  const worldPosition = sampledMesh.localToWorld(position)
  dummy.position.copy(worldPosition)

  dummy.lookAt(normal.clone().add(position))
  dummy.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
  dummy.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
  dummy.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
}
