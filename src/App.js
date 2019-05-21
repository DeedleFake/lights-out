// @format

import React, { useReducer, useMemo, useState, useCallback } from 'react'

import './style.css'

const App = () => {
	const [turn, setTurn] = useState(false)

	const [board, dispatchBoard] = useReducer(
		(board, action) => {
			switch (action.type) {
				case 'place':
					return board.map((row, y) =>
						row.map((space, x) =>
							x === action.space[0] && y === action.space[1]
								? action.piece
								: space,
						),
					)

				case 'reset':
					return board.map((row, y) =>
						row.map((space, x) =>
							x >= row.length / 2 - 1 &&
							x <= row.length / 2 &&
							y >= board.length / 2 - 1 &&
							y <= board.length / 2
								? (x + y) % 2 === 0
								: null,
						),
					)

				default:
					throw new Error(`Unknown action type: ${action.type}`)
			}
		},
		8,
		(size) => {
			let a = new Array(size).fill(null).map(() => new Array(size).fill(null))
			for (let y = a.length / 2 - 1; y <= a.length / 2; y++) {
				a[y][a[y].length / 2 - 1] = y % 2 !== 0
				a[y][a[y].length / 2] = y % 2 === 0
			}
			return a
		},
	)

	const score = useMemo(
		() =>
			board.reduce(
				(score, row) =>
					row.reduce(
						(score, space) => score + (space == null ? 0 : space ? 1 : -1),
						score,
					),
				0,
			),
		[board],
	)

	const toBeFlipped = useCallback(
		([sx, sy], [dx, dy], piece) => {
			const [dsx, dsy] = [
				dx > 0 ? 1 : dx < 0 ? -1 : 0,
				dy > 0 ? 1 : dy < 0 ? -1 : 0,
			]

			let flip = []
			for (
				let [x, y] = [sx + dsx, sy + dsy];
				y >= 0 &&
				y < board.length &&
				x >= 0 &&
				x < board[y].length &&
				board[y][x] != null;
				[x, y] = [x + dx, y + dy]
			) {
				if (board[y][x] === piece) {
					return flip
				}

				flip.push([x, y])
			}

			return []
		},
		[board],
	)

	const placePiece = useCallback(
		(space, piece) => {
			dispatchBoard({ type: 'place', space, piece })

			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					if (dx === 0 && dy === 0) {
						continue
					}

					for (let s of toBeFlipped(space, [dx, dy], piece)) {
						dispatchBoard({ type: 'place', space: s, piece })
					}
				}
			}
		},
		[toBeFlipped],
	)

	const isLegal = useCallback(
		(x, y) => {
			// TODO: Prevent moves that don't flip.
			return board[y][x] == null
		},
		[board],
	)

	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<div style={{ display: 'flex', flexDirection: 'column', maxWidth: 800 }}>
				<h1>Othello</h1>

				<svg
					xmlns="https://www.w3.org/2000/svg"
					style={{
						backgroundColor: 'darkgrey',
						marginTop: 16,
						border: `solid 16px ${turn ? 'white' : 'black'}`,
						borderRadius: 32,
						padding: 8,
						transition: 'border .3s',
					}}
					viewBox={`0 0 ${10 * board[0].length} ${10 * board.length}`}
				>
					{board.map((row, y) =>
						row.map((space, x) => (
							<rect
								key={x}
								style={{
									transition: 'fill .3s',
									cursor: 'pointer',
								}}
								x={10 * x + 1}
								y={10 * y + 1}
								width={8}
								height={8}
								rx={1}
								fill={space == null ? 'grey' : space ? 'white' : 'black'}
								onClick={(ev) => {
									ev.preventDefault()
									if (!isLegal(x, y)) {
										return
									}

									placePiece([x, y], turn)
									setTurn((turn) => !turn)
								}}
							/>
						)),
					)}
				</svg>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 16,
						padding: '0 32px',
					}}
				>
					<h3>
						Score:{' '}
						{score !== 0
							? `+${Math.abs(score)} ${score > 0 ? 'White' : 'Black'}'s Favor`
							: 'Tied'}
					</h3>

					<button
						style={{
							backgroundColor: 'cyan',
							borderRadius: 8,
							fontSize: 20,
							padding: 8,
							marginLeft: 8,
						}}
						onClick={() => {
							dispatchBoard({ type: 'reset' })
							setTurn(false)
						}}
					>
						Reset
					</button>
				</div>
			</div>
		</div>
	)
}

export default App
