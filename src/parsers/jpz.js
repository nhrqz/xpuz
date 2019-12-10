/**
 * JPZ Parser
 *
 * @description Parses .jpz formatted puzzles (NOT CURRENTLY IMPLEMENTED)
 * @module xpuz/parsers/jpz
 */

const isObject        = require("lodash/isObject");
const Promise         = require("bluebird");
const Puzzle          = require("../puzzle");


function _parsePuzzle(puzzle) {
	return new Promise(
		(resolve, reject) => {
			if (isObject(puzzle)) {
				return resolve(new Puzzle(puzzle));
			}
			else {
				return reject(new Error("parse() expects either a path string or an object"));
			}
		}
	);
}

/**
 * JPZ parser class
 */
class JPZParser {
	/**
	 * Parses a {@link module:xpuz/puzzle~Puzzle} from the input
	 *
	 * @param {string|object} puzzle - the source to parse the puzzle from; if a string,
	 *	it is assumed to be a file path, if an object, it defines a Puzzle object
	 *
	 * @return {external:Promise<module:xpuz/puzzle~Puzzle>} a promise that resolves with
	 *	the parsed puzzle object
	 */
	parse(puzzle) {
		return _parsePuzzle(puzzle);
	}
}

exports = module.exports = JPZParser;
