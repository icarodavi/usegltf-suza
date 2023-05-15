import '@react-three/fiber'
import React, { FC } from 'react'
import { BufferAttribute, Object3D, BufferGeometry } from 'three'

type Props = {
  compute: (geometry: BufferGeometry) => BufferAttribute
  name: string
}

/**
 * Used exclusively as a child of a BufferGeometry.
 * Computes the BufferAttribute by calling the `compute` function
 * and attaches the attribute to the geometry.
 */
export const ComputedAttribute: FC<Props> = ({ compute, name, ...props }) => {
  const [bufferAttribute] = React.useState(() => new BufferAttribute(new Float32Array(0), 1))
  const primitive = React.useRef<BufferAttribute>()

  React.useLayoutEffect(() => {
    const attr = compute(primitive.current.__r3f.parent)
    primitive.current.copy(attr)
  }, [compute])

  return (
    <primitive
      ref={primitive}
      object={bufferAttribute}
      attachObject={['attributes', name]}
      {...props}
    />
  )
}
