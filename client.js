new Vue ({
    template:`
    <div>
        <button v-on:click='play'> Play 
        </button>
        <div>{{ announce }}</div>
        
        <input v-model = 'col' placeholder='Enter Column'>
        </input><h2>
        <div v-for='b in brd'>{{ b }}</div></h2>
        <button v-on:click ='send_column'> Update </button>
    </div>
    `,

    data:{
    col: 0,
    player_turn:false,
    brd: [['.', '.', '.','.', '.', '.'],
    ['.', '.', '.','.', '.', '.'],
    ['.', '.', '.','.', '.', '.'],
    ['.', '.', '.','.', '.', '.'],
    ['.', '.', '.','.', '.', '.'],
    ['.', '.', '.','.', '.', '.'],
    ['.', '.', '.','.', '.', '.']],
    win:0,
    ws: new WebSocket('ws://localhost:8081'),
    player_symbol:'.',
    opp_symbol:'.',
    announce:'',
    },
    methods:{
        play(){
            this.ws.send(JSON.stringify({play:'set'}))
        },
        send_column(){
            if(this.player_turn===true){
                console.log(JSON.stringify({play:'play',col:this.col}))
            this.ws.send(JSON.stringify({play:'play',col:this.col}))
            }
        },
        async update(){
            console.log(this.brd[1])
                for(var j=6; j>=0; j--)
                {console.log(this.brd[j][this.col], this.col, this.player_symbol)
                        
                    if(this.brd[j][this.col]=== '.')
                    {   console.log(this.brd[j][this.col], this.player_symbol)
                        if(this.player_turn===true)
                        this.brd[j][this.col] = this.opp_symbol
                        else
                        this.brd[j][this.col] = this.player_symbol
                        this.win= this.check_win()
                        break;
                    }
                }
        },
        check_win(){
            var chk1=0
            var chk2=0
            for(var i=0; i<7; i++)
            {
                for(var j=0; j<6; j++)
                { 
                    if(this.brd[i][j]===this.player_symbol)
                    {console.log('Heere')
                        if(i+1<7 && this.brd[i+1][j]===this.player_symbol)
                        chk1+=1
                        if(i+2<7 && this.brd[i+2][j]===this.player_symbol)
                        chk1+=1
                        if(i+3<7 && this.brd[i+3][j]===this.player_symbol)
                        chk1+=1
                        console.log(chk1)
                        if(j+1<7 && this.brd[i][j+1]===this.player_symbol)
                        chk2+=1
                        if(j+2<7 && this.brd[i][j+2]===this.player_symbol)
                        chk2+=1
                        if(j+3<7 && this.brd[i][j+3]===this.player_symbol)
                        chk2+=1

                        if(chk1===3 || chk2===3)
                        return 1
                        else
                        return 0

                    }
                }
            }
        }
    },
    mounted(){
        this.ws.onmessage= event=>{console.log(event.data)
            data= JSON.parse(event.data)
            console.log(data)
            if(data.play==='set')
            {
                this.player_symbol= data.player_symbol
                this.player_turn = data.player_turn
                this.opp_symbol=data.opp_symbol
            }
            else if(data.play === 'play')
            {
                this.col= data.col-1
                this.player_turn= data.player_turn
                this.update()
                if(this.win===1)
                {
                    this.ws.send(JSON.stringify({play:'won'}))
                }
            }
            else if(data.play ==='won')
            {
                this.announce= data.announce
                console.log(this.announce)
                this.brd= [['.', '.', '.','.', '.', '.','.'],['.', '.', '.','.', '.', '.','.'],
                ['.', '.', '.','.', '.', '.','.'],['.', '.', '.','.', '.', '.','.'],['.', '.', '.','.', '.', '.','.'],
                ['.', '.', '.','.', '.', '.','.'], ['.', '.', '.','.', '.', '.','.']]
                
            }
        }

    }
}).$mount('#root')