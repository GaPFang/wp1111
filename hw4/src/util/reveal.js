/****************************************************************************
  FileName      [ reveal.js ]
  PackageName   [ src/util ]
  Author        [ Cheng-Hua Lu ]
  Synopsis      [ This file states the reaction when left clicking a cell. ]
  Copyright     [ 2022 10 ]
****************************************************************************/

export const revealed = (board, x, y, newNonMinesCount) => {
    if (board[x][y].flagged === false) board[x][y].revealed = true;
    if (board[x][y] === '💣') return { board, newNonMinesCount };
    newNonMinesCount--;
    if (board[x][y].value === 0) {
      if (x > 0 && board[x - 1][y].revealed === false) ({board, newNonMinesCount} = revealed(board, x - 1, y, newNonMinesCount))
      if (x + 1 < board.length && board[x + 1][y].revealed === false) ({board, newNonMinesCount} = revealed(board, x + 1, y, newNonMinesCount))
      if (y > 0 && board[x][y - 1].revealed === false) ({board, newNonMinesCount} = revealed(board, x, y - 1, newNonMinesCount))
      if (y + 1 < board.length && board[x][y + 1].revealed === false) ({board, newNonMinesCount} = revealed(board, x, y + 1,newNonMinesCount))
    }

    // Advanced TODO: reveal cells in a more intellectual way.
    // Useful Hint: If the cell is already revealed, do nothing.
    //              If the value of the cell is not 0, only show the cell value.
    //              If the value of the cell is 0, we should try to find the value of adjacent cells until the value we found is not 0.
    //              The input variables 'newNonMinesCount' and 'board' may be changed in this function.

    return { board, newNonMinesCount };
};
