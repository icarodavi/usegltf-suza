import React, { Suspense, useRef } from 'react'
import { Canvas, extend } from '@react-three/fiber'

import './styles.css'
import { Environment, OrbitControls, Points, useGLTF } from '@react-three/drei'

import { ComputedAttribute } from './ComputedAttribute'
import { SurfaceSampler } from './SurfaceSampler'
import { StaticReadUsage } from 'three'
import { CylinderGeometry } from 'three'

import { LayerMaterial, Depth } from 'lamina'
import suzanne from '@gsimone/suzanne'
import { computeUpness, transformInstance } from './lib'

const key = (() => Math.random())()

class MyGeometry extends CylinderGeometry {
  constructor(rt = 0.01, rb = 0.02, h = 1) {
    super(rt, rb, h, 2, 1)

    this.translate(0, h / 2, 0)
    this.rotateX(Math.PI / 2)
  }
}

extend({ MyGeometry })

/**
 * Pass children
 */
function ChildrenAPI(props) {
  const { nodes } = useGLTF(suzanne)

  return (
    <>
      <SurfaceSampler key={key} transform={transformInstance}>
        <mesh {...props}>
          <primitive object={nodes.Suzanne.geometry} attach="geometry">
            <ComputedAttribute name="upness" compute={computeUpness} usage={StaticReadUsage} />
          </primitive>
          <LayerMaterial color="#f00" lighting="physical" envMapIntensity={0.1} />
        </mesh>

        <instancedMesh args={[null, null, 100_000]}>
          <myGeometry args={[undefined, undefined, 2]} />
          <LayerMaterial color="#00f" lighting="physical" envMapIntensity={0.5}>
            <Depth colorA="#2e0027" colorB="#0f0" near={0.12} far={2} mapping={'world'} />
          </LayerMaterial>
        </instancedMesh>
      </SurfaceSampler>
    </>
  )
}

/**
 * Pass refs.
 */
function RefsAPI(props) {
  const sampledMesh = useRef()
  const instances = useRef()

  const { nodes } = useGLTF(suzanne)

  return (
    <>
      <mesh ref={sampledMesh} {...props}>
        <primitive object={nodes.Suzanne.geometry} attach="geometry">
          <ComputedAttribute name="upness" compute={computeUpness} usage={StaticReadUsage} />
        </primitive>
        <LayerMaterial color="#2e0027" lighting="physical" envMapIntensity={0.1} />
      </mesh>

      <instancedMesh ref={instances} args={[null, null, 100_000]}>
        <myGeometry args={[undefined, undefined, 2]} />
        <LayerMaterial color="#2e0027" lighting="physical" envMapIntensity={0.5}>
          <Depth colorA="#2e0027" colorB="#ffd0d0" near={0.12} far={2} mapping={'world'} />
        </LayerMaterial>
      </instancedMesh>

      <SurfaceSampler
        key={key}
        weight="upness"
        transform={transformInstance}
        instances={instances}
        mesh={sampledMesh}
      />
    </>
  )
}

/**
 * Passes mesh as ref and instancedMesh as child
 */
function MixedAPI(props) {
  const sampledMesh = useRef()
  const { nodes } = useGLTF(suzanne)

  return (
    <>
      <mesh ref={sampledMesh} {...props}>
        <primitive object={nodes.Suzanne.geometry} attach="geometry">
          <ComputedAttribute name="upness" compute={computeUpness} usage={StaticReadUsage} />
        </primitive>
        <LayerMaterial color="#2e0027" lighting="physical" envMapIntensity={0.1} />
      </mesh>

      <SurfaceSampler key={key} transform={transformInstance} mesh={sampledMesh}>
        <instancedMesh args={[null, null, 100_000]}>
          <myGeometry args={[undefined, undefined, 2]} />
          <LayerMaterial color="#2e0027" lighting="physical" envMapIntensity={0.5}>
            <Depth colorA="#2e0027" colorB="#ffd0d0" near={0.12} far={2} mapping={'world'} />
          </LayerMaterial>
        </instancedMesh>
      </SurfaceSampler>
    </>
  )
}

/**
 * Passes instancedMesh as ref and mesh as child
 */
function MixedAPI2(props) {
  const sampledMesh = useRef()
  const instances = useRef()

  const { nodes } = useGLTF(suzanne)

  return (
    <>
      <instancedMesh ref={instances} args={[null, null, 100_000]}>
        <myGeometry args={[undefined, undefined, 2]} />
        <LayerMaterial color="#2e0027" lighting="physical" envMapIntensity={0.5}>
          <Depth colorA="#2e0027" colorB="#ffd0d0" near={0.12} far={2} mapping={'world'} />
        </LayerMaterial>
      </instancedMesh>

      <SurfaceSampler
        instances={instances}
        key={key}
        transform={transformInstance}
        mesh={sampledMesh}>
        <mesh ref={sampledMesh} {...props}>
          <primitive object={nodes.Suzanne.geometry} attach="geometry" />
          <LayerMaterial color="#2e0027" lighting="physical" envMapIntensity={0.1} />
        </mesh>
      </SurfaceSampler>
    </>
  )
}

function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10] }}>
      <Suspense fallback={null}>
        <Environment preset="dawn" />
        <RefsAPI position-x={-1.25} />
        <ChildrenAPI position-x={1.25} />
        <MixedAPI position-y={1.25} />
        <MixedAPI2 position-y={-1.25} />
      </Suspense>
      {/* <DebugGeometry /> */}
      <color args={['#080406']} attach="background" />
      <OrbitControls />
    </Canvas>
  )
}

export default Scene
