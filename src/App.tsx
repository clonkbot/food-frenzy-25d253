import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text, Environment, RoundedBox, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

type FoodType = 'hamburger' | 'donut' | 'pizza' | null
type Cell = {
  id: string
  type: FoodType
  row: number
  col: number
  isSelected: boolean
  isMatched: boolean
  isNew: boolean
}

const GRID_SIZE = 6
const FOOD_TYPES: FoodType[] = ['hamburger', 'donut', 'pizza']

// Hamburger Component - juicy 3D burger
function Hamburger({ isSelected, isMatched, onClick }: { isSelected: boolean; isMatched: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (isSelected) {
      groupRef.current.rotation.y += delta * 3
    }
    if (isMatched) {
      groupRef.current.scale.setScalar(Math.max(0, groupRef.current.scale.x - delta * 2))
    }
  })

  return (
    <group ref={groupRef} onClick={onClick} scale={isSelected ? 1.2 : 1}>
      {/* Bottom bun */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.35, 0.15, 32]} />
        <meshStandardMaterial color="#E8A952" roughness={0.6} />
      </mesh>
      {/* Lettuce */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.42, 0.4, 0.05, 32]} />
        <MeshWobbleMaterial color="#7CB342" factor={0.3} speed={2} />
      </mesh>
      {/* Patty */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.12, 32]} />
        <meshStandardMaterial color="#5D4037" roughness={0.8} />
      </mesh>
      {/* Cheese */}
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[0.6, 0.03, 0.6]} />
        <meshStandardMaterial color="#FFC107" roughness={0.4} />
      </mesh>
      {/* Top bun */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#E8A952" roughness={0.6} />
      </mesh>
      {/* Sesame seeds */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * 1.2) * 0.2, 0.35 + Math.sin(i) * 0.05, Math.sin(i * 1.2) * 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#FFFDE7" />
        </mesh>
      ))}
    </group>
  )
}

// Donut Component - glazed perfection
function Donut({ isSelected, isMatched, onClick }: { isSelected: boolean; isMatched: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (isSelected) {
      groupRef.current.rotation.y += delta * 3
    }
    if (isMatched) {
      groupRef.current.scale.setScalar(Math.max(0, groupRef.current.scale.x - delta * 2))
    }
  })

  return (
    <group ref={groupRef} onClick={onClick} scale={isSelected ? 1.2 : 1} rotation={[Math.PI / 2, 0, 0]}>
      {/* Donut base */}
      <mesh castShadow>
        <torusGeometry args={[0.3, 0.15, 16, 32]} />
        <meshStandardMaterial color="#D4A574" roughness={0.7} />
      </mesh>
      {/* Pink frosting */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.3, 0.12, 16, 32]} />
        <meshStandardMaterial color="#FF69B4" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Sprinkles */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.3,
              0.15,
              Math.sin(angle) * 0.3
            ]}
            rotation={[0, angle, Math.PI / 4]}
          >
            <capsuleGeometry args={[0.015, 0.04, 4, 8]} />
            <meshStandardMaterial color={colors[i % colors.length]} />
          </mesh>
        )
      })}
    </group>
  )
}

// Pizza Component - cheesy slice
function Pizza({ isSelected, isMatched, onClick }: { isSelected: boolean; isMatched: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (isSelected) {
      groupRef.current.rotation.y += delta * 3
    }
    if (isMatched) {
      groupRef.current.scale.setScalar(Math.max(0, groupRef.current.scale.x - delta * 2))
    }
  })

  const sliceShape = new THREE.Shape()
  sliceShape.moveTo(0, 0)
  sliceShape.lineTo(-0.35, 0.6)
  sliceShape.quadraticCurveTo(0, 0.75, 0.35, 0.6)
  sliceShape.lineTo(0, 0)

  return (
    <group ref={groupRef} onClick={onClick} scale={isSelected ? 1.2 : 1} rotation={[-Math.PI / 6, 0, 0]}>
      {/* Crust/base */}
      <mesh castShadow position={[0, 0, 0]}>
        <extrudeGeometry args={[sliceShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 }]} />
        <meshStandardMaterial color="#E8A952" roughness={0.7} />
      </mesh>
      {/* Tomato sauce */}
      <mesh position={[0, 0.01, 0.09]}>
        <extrudeGeometry args={[sliceShape, { depth: 0.02, bevelEnabled: false }]} />
        <meshStandardMaterial color="#D32F2F" roughness={0.8} />
      </mesh>
      {/* Cheese */}
      <mesh position={[0, 0.02, 0.11]}>
        <extrudeGeometry args={[sliceShape, { depth: 0.02, bevelEnabled: false }]} />
        <MeshWobbleMaterial color="#FFEB3B" factor={0.1} speed={1} roughness={0.4} />
      </mesh>
      {/* Pepperoni */}
      {[[0, 0.35], [-0.15, 0.5], [0.15, 0.5]].map(([x, y], i) => (
        <mesh key={i} position={[x, 0.04, 0.13 + y * 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// Food Item wrapper
function FoodItem({ type, isSelected, isMatched, onClick, position }: {
  type: FoodType
  isSelected: boolean
  isMatched: boolean
  onClick: () => void
  position: [number, number, number]
}) {
  if (!type) return null

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        {type === 'hamburger' && <Hamburger isSelected={isSelected} isMatched={isMatched} onClick={onClick} />}
        {type === 'donut' && <Donut isSelected={isSelected} isMatched={isMatched} onClick={onClick} />}
        {type === 'pizza' && <Pizza isSelected={isSelected} isMatched={isMatched} onClick={onClick} />}
      </group>
    </Float>
  )
}

// Game Board
function GameBoard({ grid, onCellClick }: { grid: Cell[][]; onCellClick: (row: number, col: number) => void }) {
  return (
    <group>
      {/* Board base */}
      <RoundedBox args={[7, 0.3, 7]} radius={0.1} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#2D1B14" roughness={0.8} />
      </RoundedBox>

      {/* Grid cells */}
      {grid.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <group key={cell.id}>
            {/* Cell background */}
            <RoundedBox
              args={[1, 0.1, 1]}
              radius={0.05}
              position={[colIdx - 2.5, -0.3, rowIdx - 2.5]}
            >
              <meshStandardMaterial
                color={(rowIdx + colIdx) % 2 === 0 ? '#3E2723' : '#4E342E'}
                roughness={0.9}
              />
            </RoundedBox>
            {/* Food item */}
            <FoodItem
              type={cell.type}
              isSelected={cell.isSelected}
              isMatched={cell.isMatched}
              onClick={() => onCellClick(rowIdx, colIdx)}
              position={[colIdx - 2.5, 0.2, rowIdx - 2.5]}
            />
          </group>
        ))
      )}
    </group>
  )
}

// Score display in 3D
function ScoreDisplay({ score, combo }: { score: number; combo: number }) {
  return (
    <group position={[0, 4, -3]}>
      <Text
        fontSize={0.8}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000"
        font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivNm4I81PZQ.woff2"
      >
        {score.toString().padStart(6, '0')}
      </Text>
      {combo > 1 && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.4}
          color="#FF4081"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
          font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivNm4I81PZQ.woff2"
        >
          {`COMBO x${combo}`}
        </Text>
      )}
    </group>
  )
}

// Main App
export default function App() {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: Cell[][] = []
    for (let row = 0; row < GRID_SIZE; row++) {
      const gridRow: Cell[] = []
      for (let col = 0; col < GRID_SIZE; col++) {
        gridRow.push({
          id: `${row}-${col}`,
          type: FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)],
          row,
          col,
          isSelected: false,
          isMatched: false,
          isNew: false,
        })
      }
      newGrid.push(gridRow)
    }
    return newGrid
  }, [])

  useEffect(() => {
    setGrid(initializeGrid())
  }, [initializeGrid])

  // Check for matches
  const findMatches = useCallback((currentGrid: Cell[][]): Set<string> => {
    const matches = new Set<string>()

    // Check horizontal matches
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const type = currentGrid[row][col].type
        if (type &&
            currentGrid[row][col + 1].type === type &&
            currentGrid[row][col + 2].type === type) {
          matches.add(`${row}-${col}`)
          matches.add(`${row}-${col + 1}`)
          matches.add(`${row}-${col + 2}`)
        }
      }
    }

    // Check vertical matches
    for (let row = 0; row < GRID_SIZE - 2; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const type = currentGrid[row][col].type
        if (type &&
            currentGrid[row + 1][col].type === type &&
            currentGrid[row + 2][col].type === type) {
          matches.add(`${row}-${col}`)
          matches.add(`${row + 1}-${col}`)
          matches.add(`${row + 2}-${col}`)
        }
      }
    }

    return matches
  }, [])

  // Process matches and drop pieces
  const processMatches = useCallback(async (currentGrid: Cell[][], currentCombo: number) => {
    const matches = findMatches(currentGrid)

    if (matches.size === 0) {
      setCombo(0)
      setIsProcessing(false)
      return
    }

    // Mark matched cells
    const newGrid = currentGrid.map(row =>
      row.map(cell => ({
        ...cell,
        isMatched: matches.has(cell.id),
      }))
    )
    setGrid(newGrid)

    // Update score
    const matchScore = matches.size * 10 * (currentCombo + 1)
    setScore(prev => prev + matchScore)
    setCombo(currentCombo + 1)

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300))

    // Remove matched and drop
    const droppedGrid: Cell[][] = JSON.parse(JSON.stringify(newGrid))

    for (let col = 0; col < GRID_SIZE; col++) {
      const column: FoodType[] = []
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (!matches.has(`${row}-${col}`)) {
          column.push(droppedGrid[row][col].type)
        }
      }

      // Fill from bottom
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        const idx = GRID_SIZE - 1 - row
        if (idx < column.length) {
          droppedGrid[row][col].type = column[idx]
          droppedGrid[row][col].isMatched = false
          droppedGrid[row][col].isNew = false
        } else {
          droppedGrid[row][col].type = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)]
          droppedGrid[row][col].isMatched = false
          droppedGrid[row][col].isNew = true
        }
      }
    }

    setGrid(droppedGrid)

    // Wait and check for cascades
    await new Promise(resolve => setTimeout(resolve, 200))
    processMatches(droppedGrid, currentCombo + 1)
  }, [findMatches])

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (isProcessing) return

    if (!selectedCell) {
      // First selection
      setSelectedCell({ row, col })
      setGrid(prev =>
        prev.map((r, rIdx) =>
          r.map((c, cIdx) => ({
            ...c,
            isSelected: rIdx === row && cIdx === col,
          }))
        )
      )
    } else {
      // Check if adjacent
      const isAdjacent =
        (Math.abs(selectedCell.row - row) === 1 && selectedCell.col === col) ||
        (Math.abs(selectedCell.col - col) === 1 && selectedCell.row === row)

      if (isAdjacent) {
        setIsProcessing(true)

        // Swap
        const newGrid = grid.map(r => r.map(c => ({ ...c, isSelected: false })))
        const temp = newGrid[row][col].type
        newGrid[row][col].type = newGrid[selectedCell.row][selectedCell.col].type
        newGrid[selectedCell.row][selectedCell.col].type = temp

        // Check if swap creates match
        const matches = findMatches(newGrid)

        if (matches.size > 0) {
          setGrid(newGrid)
          setTimeout(() => processMatches(newGrid, 0), 100)
        } else {
          // Swap back - invalid move
          const revertGrid = grid.map(r => r.map(c => ({ ...c, isSelected: false })))
          setGrid(revertGrid)
          setIsProcessing(false)
        }
      } else {
        // Select new cell
        setGrid(prev =>
          prev.map((r, rIdx) =>
            r.map((c, cIdx) => ({
              ...c,
              isSelected: rIdx === row && cIdx === col,
            }))
          )
        )
      }

      setSelectedCell(isAdjacent ? null : { row, col })
    }
  }, [selectedCell, grid, isProcessing, findMatches, processMatches])

  // Reset game
  const resetGame = () => {
    setGrid(initializeGrid())
    setScore(0)
    setCombo(0)
    setSelectedCell(null)
    setIsProcessing(false)
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a05 0%, #2d1810 50%, #1a0a05 100%)' }}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Neon glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Game title */}
      <div className="absolute top-4 md:top-6 left-0 right-0 text-center z-10 pointer-events-none">
        <h1
          className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-wider px-4"
          style={{
            fontFamily: "'Bangers', cursive",
            color: '#FFD700',
            textShadow: '3px 3px 0 #FF4500, 6px 6px 0 #FF6B35, 0 0 30px rgba(255, 107, 53, 0.5)',
            letterSpacing: '0.1em'
          }}
        >
          FOOD FRENZY
        </h1>
        <p
          className="text-xs md:text-sm mt-1 md:mt-2 tracking-widest px-4"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: '#FF69B4',
            textShadow: '0 0 10px rgba(255, 105, 180, 0.8)'
          }}
        >
          TAP TO MATCH!
        </p>
      </div>

      {/* Score HUD */}
      <div className="absolute top-20 md:top-24 left-4 md:left-8 z-10 pointer-events-none">
        <div
          className="bg-gradient-to-r from-orange-900/80 to-red-900/80 backdrop-blur-sm rounded-lg md:rounded-xl px-3 md:px-6 py-2 md:py-3 border-2 border-yellow-500/50"
          style={{ boxShadow: '0 0 20px rgba(255, 165, 0, 0.3)' }}
        >
          <p
            className="text-yellow-400 text-xs mb-0.5 md:mb-1"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px' }}
          >
            SCORE
          </p>
          <p
            className="text-lg md:text-2xl text-white font-bold"
            style={{ fontFamily: "'Bangers', cursive", letterSpacing: '0.1em' }}
          >
            {score.toString().padStart(6, '0')}
          </p>
        </div>

        {combo > 1 && (
          <div
            className="mt-2 bg-gradient-to-r from-pink-600/80 to-purple-600/80 backdrop-blur-sm rounded-lg px-3 md:px-4 py-1 md:py-2 border-2 border-pink-400/50 animate-bounce"
            style={{ boxShadow: '0 0 20px rgba(255, 105, 180, 0.5)' }}
          >
            <p
              className="text-white text-xs md:text-sm"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}
            >
              COMBO x{combo}!
            </p>
          </div>
        )}
      </div>

      {/* Reset button */}
      <button
        onClick={resetGame}
        className="absolute top-20 md:top-24 right-4 md:right-8 z-10 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border-b-4 border-red-900 active:border-b-0 active:mt-1 transition-all touch-manipulation"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '10px',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
          minWidth: '44px',
          minHeight: '44px'
        }}
      >
        NEW
      </button>

      {/* Instructions overlay for mobile */}
      <div className="absolute bottom-16 md:bottom-20 left-0 right-0 text-center z-10 pointer-events-none px-4">
        <p
          className="text-yellow-300/70 text-xs"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', lineHeight: '1.5' }}
        >
          TAP TWO ADJACENT FOODS TO SWAP
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 6, 8], fov: 50 }}
        shadows
        className="touch-manipulation"
        style={{ touchAction: 'manipulation' }}
      >
        <color attach="background" args={['#1a0a05']} />
        <fog attach="fog" args={['#1a0a05', 10, 25]} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, -5]} color="#FF6B35" intensity={0.8} />
        <pointLight position={[5, 5, -5]} color="#FF69B4" intensity={0.8} />

        <Suspense fallback={null}>
          <GameBoard grid={grid} onCellClick={handleCellClick} />
          <Environment preset="warehouse" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={6}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          enableDamping
          dampingFactor={0.05}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />
      </Canvas>

      {/* Footer */}
      <footer
        className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center z-10 px-4"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '6px',
          color: 'rgba(255, 200, 150, 0.4)',
          letterSpacing: '0.05em'
        }}
      >
        Requested by @web-user · Built by @clonkbot
      </footer>
    </div>
  )
}
