
export const Box = x => 
({
ap: b2 => b2.map(x),
chain : f => f(x),
map: f => Box(f(x)),
fold: f => f(x),
inspect: () => `Box{${x}}`   
})


export const Right = x => 
({
chain : f => f(x),
map: f => Right(f(x)),
fold: (f,g) => g(x),
inspect: () => `Right{${x}}`   
})

export const Left = x => 
({
chain : f => Left(x),
map: f => Left(x),
fold: (f,g) => f(x),
inspect: () => `Left{${x}}`   
})

export const tryCatch = f => {
    try{
        return Right(f())
    }catch(e){
        ////console.log(e)
        return Left(e)
    }
}

//const readFl = () => "{\"port\":888}"

////console.log( tryCatch( () => "{port:888}" ) )

// const getPort = () =>
// tryCatch( () => readFl() ) //fs.readFileSync('config.json'))
// .chain(c => tryCatch( () => JSON.parse(c))  )
// .fold(e=>3000, c => c.port)


export const findColor = name => fromNullable({'red':'Red', 'blue':'Blue', 'green':'Green'}[name])

const fromNullable = x => x != null ? Right(x) : Left(null)

// export const resColor = findColor('red')
// .map(c => c.slice(1))
// .fold( e => 'not found', c => c.toUpperCase())

//export const resColor = getPort();

export const charForStr = str => 
[str]
.map(s => s.trim())
.map(r => parseInt(r))
.map(i => i+1)
.map(i => String.fromCharCode(i))