
const Right = x => 
({
chain : f => f(x),
map: f => Right(f(x)),
fold: (f,g) => g(x),
inspect: () => `Right{${x}}`   
})

const Left = x => 
({
chain : f => Left(x),
map: f => Left(x),
fold: (f,g) => f(x),
inspect: () => `Left{${x}}`   
})

const tryCatch = f => {
    try{
        Right(f())
    }catch(e){
        return Left(e)
    }
}

export const findColor = name => fromNullable({'red':'Red', 'blue':'Blue', 'green':'Green'}[name])

const fromNullable = x => x != null ? Right(x) : Left(null)

export const result = findColor('red')
.map(c => c.slice(1))
.fold( e => 'not found', c => c.toUpperCase())

export const charForStr = str => 
[str]
.map(s => s.trim())
.map(r => parseInt(r))
.map(i => i+1)
.map(i => String.fromCharCode(i))