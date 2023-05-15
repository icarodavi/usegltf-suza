
function Thing() {
  return (
    <SurfaceSampler
      key={key}
      weight="upness"
      /**
       * Transforms each instance based on the sample
       */
      transform={({ object, position }, i) => {
        object.scale.setScalar(Math.random() * 0.1)
        object.position.copy(position)

        return object
      }}>
      <mesh>
        <torusKnotGeometry>
          <ComputedAttribute
            name="upness"
            computeAttribute={(geometry) => {
              const { array, count } = geometry.attributes.normal
              const arr = Float32Array.from({ length: count })

              const normalVector = new Vector3()
              const up = new Vector3(0, 1, 0)

              for (let i = 0; i < count; i++) {
                const n = array.slice(i * 3, i * 3 + 3)
                normalVector.set(...n)

                const value = normalVector.dot(up) > 0.8
                arr[i] = value
              }

              return new BufferAttribute(arr, 1)
            }}
            usage={StaticReadUsage}
          />
        </torusKnotGeometry>
        <meshNormalMaterial />
      </mesh>

      <instancedMesh args={[null, null, 1_000]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshNormalMaterial />
      </instancedMesh>
    </SurfaceSampler>
  )
}