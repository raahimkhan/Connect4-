const ws= require('ws')

first= undefined
player= {}
const s=new ws.Server({port:8081})
s.on('connection', client=>
{
        client.on('message', msg=>{console.log(msg)
        recv = JSON.parse(msg)

        if(recv.play === 'set')
        {
            if(first)
            {
                console.log('Player 2')
                first.send(JSON.stringify({play:'set', player_turn:false, player_symbol:'O', opp_symbol:'X'}))
                client.send(JSON.stringify({play:'set', player_turn:true, player_symbol:'X', opp_symbol:'O'}))
                player= {first:first, second:client}
            }
            else
            {
                console.log('Player 1')
                first = client
            }
        }
        else if(recv.play ==='play')
        {
            if(player.first === client)
            {player.first.send(JSON.stringify({play:'play', col:recv.col, player_turn:false}))
            player.second.send(JSON.stringify({play:'play', col:recv.col, player_turn:true}))
            }
            else
            {player.second.send(JSON.stringify({play:'play', col:recv.col, player_turn:false}))
            player.first.send(JSON.stringify({play:'play', col:recv.col, player_turn:true}))
            }

        }
        else if(recv.play==='won')
        {
            if(player.second === client)
            {player.first.send(JSON.stringify({play:'won', announce:'You lost'}))
            player.second.send(JSON.stringify({play:'won', announce:'You won'}))
            }
            else
            {player.second.send(JSON.stringify({play:'won', announce:'You lost'}))
            player.first.send(JSON.stringify({play:'won', announce:'You won'}))
            }
        }
    })
})