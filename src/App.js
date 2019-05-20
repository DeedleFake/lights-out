// @format

import React, { useReducer, useMemo, useState } from 'react'

import './style.css'

const App = () => {
	const [size, setSize] = useState(5)

	const [board, dispatchBoard] = useReducer(
		(board, action) => {
			switch (action.type) {
				case 'toggle':
					return board.map((row, y) =>
						row.map((space, x) =>
							(Math.abs(action.space[0] - x) <= 1 && action.space[1] === y) ||
							(Math.abs(action.space[1] - y) <= 1 && action.space[0] === x)
								? !space
								: space,
						),
					)

				case 'reset':
					return new Array(action.size).fill(new Array(action.size).fill(true))

				default:
					throw new Error(`Unknown action type: ${action.type}`)
			}
		},
		size,
		(size) => new Array(size).fill(new Array(size).fill(true)),
	)

	const won = useMemo(
		() => board.every((row) => row.every((space) => !space)),
		[board],
	)

	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<h2>Lights Out</h2>

			<svg
				xmlns="https://www.w3.org/2000/svg"
				style={{ width: 300, marginTop: 16, border: `solid 16px ${won ? 'green' : 'grey'}`, borderRadius: 32 }}
				viewBox={`0 0 ${10 * board[0].length} ${10 * board.length}`}
			>
				{board.map((row, y) =>
					row.map((space, x) => (
						<circle
							key={x}
							style={{
								cursor: 'pointer',
							}}
							cx={10 * x + 5}
							cy={10 * y + 5}
							r={4}
							fill={space ? 'lightblue' : 'darkblue'}
							onClick={(ev) => {
								ev.preventDefault()
								dispatchBoard({ type: 'toggle', space: [x, y] })
							}}
						/>
					)),
				)}
			</svg>

			<div style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>
				<input
					style={{
						fontSize: 20,
					}}
					type="number"
					min="2"
					max="10"
					value={size}
					onChange={(ev) => {
						let val = parseInt(ev.target.value, 10)
						setSize((size) => isNaN(val) || val < 2 || val > 10 ? size : val)
					}}
				/>

				<button
					style={{
						backgroundColor: 'cyan',
						borderRadius: 8,
						fontSize: 20,
						padding: 8,
						marginLeft: 8,
					}}
					onClick={() => dispatchBoard({ type: 'reset', size })}
				>
					{size !== board.length ? 'Resize' : 'Reset'}
				</button>
			</div>

			{won && <h2 style={{ marginTop: 16 }}>Congratulations</h2>}
		</div>
	)
}

export default App
