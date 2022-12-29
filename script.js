let matrix = []


function cambiarNumero (){

    // console.log('siiiii',this.id);
    let fila = Math.floor((+this.id)/10);
    let columna = (+this.id)%10;
    if(this.innerHTML === ''){
        this.innerHTML = 1;
        matrix[fila][columna] = 1;
    }else if(this.innerHTML === '9'){
        this.innerHTML = '';
        matrix[fila][columna] = -1;
    }else{
        let n_actual = +this.innerHTML;
        this.innerHTML = n_actual+1;
        ++matrix[fila][columna];
    }

}

function actualizarSudoku(str_sudoku){
    for(let i = 0; i < str_sudoku.length;++i){
        let row = Math.floor(i/9);
        let col = i % 9;
        let casilla_actual = document.getElementById(row.toString() + col.toString());
        casilla_actual.innerHTML = str_sudoku[i] == ' ' ? '' : str_sudoku[i];
        matrix[row][col] = str_sudoku[i] == ' ' ? -1 : +str_sudoku[i];
    }

    // for(let i = 0; str_sudoku.length < 81 ;++i){
    //     let row = Math.floor(i/9);
    //     let col = i % 9;
    //     let casilla_actual = document.getElementById(row.toString() + col.toString());
    //     casilla_actual.innerHTML = '';
    //     matrix[row][col] = -1;
    // }

}

function actualizarSudoku2(str_sudoku){
    for(let i = 0; i < str_sudoku.length;++i){
        let row = Math.floor(i/9);
        let col = i % 9;
        let casilla_actual = document.getElementById(row.toString() + col.toString());
        casilla_actual.innerHTML = str_sudoku[i] == ' ' ? '' : str_sudoku[i];
    }

    // for(let i = 0; str_sudoku.length < 81 ;++i){
    //     let row = Math.floor(i/9);
    //     let col = i % 9;
    //     let casilla_actual = document.getElementById(row.toString() + col.toString());
    //     casilla_actual.innerHTML = '';
    //     matrix[row][col] = -1;
    // }

}



let sudoku_canvas = document.querySelector('.sudoku')


for(let i = 0; i < 9;++i){
    let nueva_fila = document.createElement('div')
    nueva_fila.className = 'filita' 
    nueva_fila.id = i.toString()
    sudoku_canvas.appendChild(nueva_fila);
    let fila_matrix = []

    for(let j = 0; j < 9;++j){
        let nueva_celda = document.createElement('div')
        nueva_celda.className = 'celda' 
        nueva_celda.onclick = cambiarNumero;
        nueva_celda.id = i.toString() + j.toString();
        nueva_fila.appendChild(nueva_celda)
        fila_matrix.push(-1);
        if(j === 8){
            nueva_celda.className += ' ' + 'celda-mas-derecha'
        }
        if(i === 0){
            nueva_celda.className += ' ' + 'celda-superior'
        }


    }
    matrix.push(fila_matrix)
    
}

function copiar(mat){
    let n_mat = []

    for(let i = 0; i < mat.length;++i){
        let fila_actual = []
        for(let j = 0; j < mat[0].length;++j){
            fila_actual.push(mat[i][j])
        }
        n_mat.push(fila_actual)

    }
    return n_mat
}

let total = 0;

function verificarSolucion(mat){

    // console.log(total++);
    total++;

    // actualizarSudoku2(nueva_gui);

    for(let i = 0; i < 9; ++i){
        const set = new Set();

        for(let j = 0; j < 9;++j){
            if(mat[i][j] == -1)
                return false;
            else
                set.add(mat[i][j]);
        }

        if(set.size < 9)
            return false;
        
        set.clear()

        for(let j = 0; j < 9;++j){
            if(mat[j][i] == -1)
                return false;
            else
                set.add(mat[j][i]);
        }

        if(set.size < 9)
            return false;

    }

    for(let k1 = 0; k1 < 3;++k1){
        for(let k2 = 0; k2 < 3; ++k2){
            const set = new Set();
            for(let i = 0; i < 3;++i){
                for(let j = 0; j < 3;++j){
                    let i_local = k1*3 + i;
                    let j_local = k2*3 + j;
                    set.add(mat[i_local][j_local]);
                }
            }
            if(set.size < 9)
                return false;
        }
   }



   return true;
}


function backtrack(mat,pos_actual){
    if(pos_actual == 81 ){
        return verificarSolucion(mat) ?  mat : false;
    }else if(pos_actual < 81){

        let i = Math.floor(pos_actual/9);
        let j = pos_actual % 9;
        let fila = new Set();
        let columna = new Set();


        if(mat[i][j] === -1){
            for(let k = 0; k < 9;++k){
                if(mat[i][k] != -1)
                    fila.add(mat[i][k]);
                if(mat[k][j] != -1)
                    columna.add(mat[k][j]);
            }

            for(let k = 1; k <= 9; ++k){
                mat[i][j] = k;
                let size_fila = fila.size;
                let size_columna = columna.size;
                fila.add(k);
                columna.add(k);

                if(fila.size == size_fila || columna.size == size_columna)
                    continue;
                let result = backtrack(mat,pos_actual+1);
                if(result)
                    return result;

                fila.delete(k);
                columna.delete(k);
            }
            mat[i][j] = -1;
        }else{
            let result = backtrack(mat,pos_actual+1);
            if(result)
                return result;
        }

    }
}




window.oncontextmenu = e => {
    e.preventDefault();
    matrix = backtrack(matrix,0)
    console.log(matrix);

    let nueva_gui = '';

    for(let i = 0; i < 9;++i){
        for(let j = 0; j < 9;++j){
            nueva_gui += matrix[i][j] == -1 ? ' ': matrix[i][j].toString();
        }
    }

    actualizarSudoku2(nueva_gui);
    console.log(total);

    
};


// actualizarSudoku('47 8 5      21 4 3           5    28  6   9  18    6           2 1 79      5 8 94')
// actualizarSudoku('6531874928926431754719258363 8 795211 75329685298 1347235714689716398254984256713')
actualizarSudoku('3  2 71   62   3  8       45348 1 767 16 54 828 7 35199       2  8   79   74 9  3')
// actualizarSudoku(' 6 1 4 5   83 56  2       18  4 7  6  6   3  7  9 1  45       2  72 69   4 5 8 7 ')



