import * as THREE from 'three'
import Player from  './player.js'

class GameState
{
    constructor({tickRate})
    {
        this.players = {}
        this.tickRate
    }


    onClientSpawnRequest(socket)
    {
        console.log(`Spawning new player with ID: ${socket.id}!`)

        const newPlayerObject3D = new THREE.Object3D()
        newPlayerObject3D.position.set(Math.random() * 10 - 5, 1, Math.random() * 10 - 5)
        newPlayerObject3D.lookAt(new THREE.Vector3())
        newPlayerObject3D.rotateY(Math.PI)

        // create object for this player
        const player = new Player({socket, position: new THREE.Vector3(Math.random() * 10 - 5, 1, Math.random() * 10 - 5), quaternion: new THREE.Quaternion})

        this.players[socket.id] = player
        const {position, quaternion} = player

        // send state of other players
        const stateOfExistingPlayers = Object.keys(this.players).filter(id => id !== socket.id).map( id => {
            const { position, quaternion } = this.players[id]
            return {
                id: id,
                position: position,
                quaternion: quaternion
            }
        } )

        socket.emit('server:spawn-response', {spawnedPlayer: {position: position, quaternion: quaternion}, existingPlayers: stateOfExistingPlayers})

        console.log(`Players connected: [${Object.keys(this.players)}]`)
        socket.broadcast.emit('other-clients:spawn-broadcast', {id: socket.id, position: position, quaternion: quaternion})
    }

    onPlayerRotate({socket, position, quaternion})
    {
        const player = this.players[socket.id]
        player.quaternion.set(quaternion)

        console.log(`Player ${socket.id} rotated to ${JSON.stringify(quaternion)}`)

        // let others know this player has moved
        socket.broadcast.emit('server:other-player-rotated', {id: socket.id, quaternion: quaternion, position: player.position})
    }

   deletePlayer(socketID)
   {
       delete this.players[socketID]
   }

}

export default GameState
