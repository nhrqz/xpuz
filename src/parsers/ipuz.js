/**
 * IPUZ file parser.
 *
 * @module xpuz/parsers/ipuz
 */

const Promise         = require("bluebird");
const max             = require("lodash/max");
const get             = require("lodash/get");
const isObject        = require("lodash/isObject");
const reduce          = require("lodash/reduce");
const Puzzle          = require("../puzzle");

const BLOCK_VALUE = "#";

function _checkDimensions(puzzle) {
	const errors = [];

	const maxCellWidth = max(
		puzzle.puzzle,
		"length"
	).length;

	const numRows = puzzle.puzzle.length;

	if (maxCellWidth > puzzle.dimensions.width) {
		errors.push(`Too many puzzle cells (${maxCellWidth}) for puzzle width (${puzzle.dimensions.width})`);
	}

	if (numRows > puzzle.dimensions.height) {
		errors.push(`Too many puzzle cells (${numRows}) for puzzle height (${puzzle.dimensions.height})`);
	}

	return errors;
}

function _getClueNumber(cell) {
	return isObject(cell) ?
		cell.cell :
		cell;
}

function _addClue(obj, clue) {
	obj[clue[0]] = clue[1];

	return obj;
}

function _convertPuzzle(ipuz) {
	const puzzle = new Puzzle({
		info: {
			title: ipuz.title,
			author: ipuz.author,
			copyright: ipuz.copyright,
			publisher: ipuz.publisher,
			difficulty: ipuz.difficulty,
			intro: ipuz.intro,
		},
		grid: ipuz.puzzle.map(
			(row) => row.map(
				(cell) => {
					if (cell === BLOCK_VALUE) {
						return {
							isBlockCell: true
						};
					}

					return {
						clueNumber: _getClueNumber(cell),
						backgroundShape: get(cell, "style.shapebg")
					};
				}
			)
		),
		clues: {
			across: reduce(ipuz.clues.across,
				_addClue,
				{}
			),
			down: reduce(ipuz.clues.down,
				_addClue,
				{}
			),
		}
	});

	return puzzle;
}

function _validatePuzzle(puzzle) {
	const errors = [];

	if (!puzzle.dimensions) {
		errors.push("Puzzle is missing 'dimensions' key");
	}

	if (puzzle.puzzle) {
		errors.push(..._checkDimensions(puzzle));
	}
	else {
		errors.push("Puzzle is missing 'puzzle' key");
	}

	return errors.length === 0 ? undefined : errors;
}

function _parsePuzzle(puzzle) {
	return new Promise(
		(resolve, reject) => {
			if (isObject(puzzle)) {
				resolve(puzzle);
				return puzzle;
			}
			else {
				return reject(new Error("parse() expects either a path string or an object"));
			}
		}
	).then(
		(puzzle) => {
			const errors = _validatePuzzle(puzzle);

			if (errors !== undefined) {
				throw new Error(`Invalid puzzle:\n\t${errors.join("\n\t")}`);
			}

			return _convertPuzzle(puzzle);
		}
	);
}

/**
 * Parser class for IPUZ-formatted puzzles
 */
class IPUZParser {
	/**
	 * Parses a {@link module:xpuz/puzzle~Puzzle|Puzzle} from the input.
	 *
	 * @param {string|object} puzzle - the source to parse the puzzle from; if a string,
	 *	it is assumed to be a file path, if an object, it defines a Puzzle object.
	 *
	 * @returns {module:xpuz/puzzle~Puzzle} the parsed {@link module:xpuz/puzzle~Puzzle|Puzzle} object
	 */
	parse(puzzle) {
		return _parsePuzzle(puzzle);
	}
}

exports = module.exports = IPUZParser;
