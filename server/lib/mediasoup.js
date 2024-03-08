const mediasoup = require("mediasoup");
// const chatProcess = require('./chat')

let users = {}
let rooms = {}; // { meetingId1: { Router, rooms: [ sicketId1, ... ] }, ...}
let peers = {}; // { socketId1: { meetingId1, socket, transports = [id1, id2,] }, producers = [id1, id2,] }, consumers = [id1, id2,], peerDetails }, ...}
let transports = []; // [ { socketId1, meetingId1, transport, consumer }, ... ]
let producers = []; // [ { socketId1, meetingId1, producer, }, ... ]
let consumers = []; // [ { socketId1, meetingId1, consumer, }, ... ]

//? This is an Array of RtpCapabilities
//? https://mediasoup.org/documentation/v3/mediasoup/rtp-parameters-and-capabilities/#RtpCodecCapability
//? list of media codecs supported by mediasoup ...
//? https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts
const mediaCodecs = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
  },
];

const screenSharingCodecs = [
  {
    kind: "video",
    mimeType: "video/VP8",
    payloadType: 96, 
    clockRate: 90000,
    channels: 1,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
  },
];

const createWorker = async () => {
  const worker = await mediasoup.createWorker({
    rtcMinPort: 2000,
    rtcMaxPort: 3000,
  });
  console.log(`worker pid ${worker.pid}`);

  worker.on("died", (error) => {
    // This implies something serious happened, so kill the application
    console.error("mediasoup worker has died");
    setTimeout(() => process.exit(1), 2000); // exit in 2 seconds
  });

  return worker;
};

const workerPromise = createWorker();

async function mediasoupProcess(meetSocket, socket) {
  const worker = await workerPromise;

  const createRoom = async (meetingId, socketId, user) => {
    // worker.createRouter(options)
    // options = { mediaCodecs, appData }
    // mediaCodecs -> defined above
    // appData -> custom application data - we are not supplying any
    // none of the two are required

    let router;
    let existingPeers = [];
    // console.log(rooms);
    if (rooms[meetingId]) {
      router = rooms[meetingId].router;
      existingPeers = rooms[meetingId].peers || [];
    } else {
      // console.log(worker);
      router = await worker.createRouter({ mediaCodecs });
    }

    console.log(`Router ID: ${router.id}`, existingPeers.length);

    rooms[meetingId] = {
      router: router,
      peers: [...existingPeers, { socketId, user }],
    };

    users[meetingId] = [
      {
        socketId,
        ...user,
      }
    ]

    // console.log(rooms);

    return router;
  };

  const removeItems = (items, socketId, type) => {
    //? For Removing items like, producers, consumers and transports..
    items.forEach((item) => {
      if (item.socketId === socket.id) {
        item[type].close();
      }
    });
    items = items.filter((item) => item.socketId !== socket.id);

    //? Returning items after removing particular item..
    return items;
  };

  //? Methods for adding producers, consumers and transports
  const addTransport = (transport, meetingId, consumer) => {
    // console.log("consumer in addTransport: ", consumer);
    transports = [
      ...transports,
      { socketId: socket.id, transport, meetingId, consumer },
    ];

    // console.log("Transports after adding new transport: ", transports);

    peers[socket.id] = {
      ...peers[socket.id],
      transports: [...peers[socket.id].transports, transport.id],
    };
    // console.log("Peers after adding new transport to Peer: ", peers);
  };

  const addProducer = (producer, meetingId) => {
    producers = [...producers, { socketId: socket.id, producer, meetingId }];

    // console.log("Producers after adding new producer: ", producers);

    peers[socket.id] = {
      ...peers[socket.id],
      producers: [...peers[socket.id].producers, producer.id],
    };

    // console.log("Peers after adding new producer to Peer: ", peers);
  };

  const addConsumer = (consumer, meetingId) => {
    // add the consumer to the consumers list
    consumers = [...consumers, { socketId: socket.id, consumer, meetingId }];

    // add the consumer id to the peers list
    peers[socket.id] = {
      ...peers[socket.id],
      consumers: [...peers[socket.id].consumers, consumer.id],
    };
  };

  const informConsumers = (meetingId, socketId, id) => {
    console.log(
      `just joined, id: ${id}, meetingId: ${meetingId}, socketId: ${socketId}`
    );
    // A new producer just joined
    // let all consumers to consume this producer
    producers.forEach((producerData) => {
      if (
        producerData.socketId !== socketId &&
        producerData.meetingId === meetingId
      ) {
        const producerSocket = peers[producerData.socketId].socket;
        // console.log("Meeting ID:", meetingId);
        // console.log("Socket ID:", socketId);
        // console.log("Old User Socket ID:", producerSocket.id);
        // console.log("producerSocket: ", producerSocket.id);
        // use socket to send producer id to producer
        producerSocket.emit("newProducer", { producerId: id });
      }
    });
  };

  const getTransport = (socketId) => {
    const [producerTransport] = transports.filter(
      (transport) => transport.socketId === socketId && !transport.consumer
    );
    return producerTransport.transport;
  };

  //? To create a WebRtcTransport for created router..
  const createWebRtcTransport = async (router, enableSctp) => {
    return new Promise(async (resolve, reject) => {
      try {
        //? https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
        const webRtcTransport_options = {
          listenIps: [
            {
              ip: "127.0.0.1", //? replace with relevant IP address
              // announcedIp: '192.168.0.106',
            },
          ],
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
          enableSctp,
        };

        //? https://mediasoup.org/documentation/v3/mediasoup/api/#router-createWebRtcTransport
        let transport = await router.createWebRtcTransport(
          webRtcTransport_options
        );
        console.log(`transport id: ${transport.id}`);

        transport.on("dtlsstatechange", (dtlsState) => {
          if (dtlsState === "closed") {
            transport.close();
          }
        });

        transport.on("close", () => {
          console.log("transport closed");
        });

        resolve(transport);
      } catch (error) {
        reject(error);
      }
    });
  };

  // const createScreenSharingTransport = async (router) => {
  //   return createWebRtcTransport(router, true);
  // };

  //? Listen for joining room event..
  socket.on("joinRoom", async ({ meetingId, user }, callback) => {
    //? create Router if it does not exist
    // console.log('joinroom');
    console.log("this is room: ", rooms);

    const router =
      (rooms[meetingId] && rooms[meetingId].router) ||
      (await createRoom(meetingId, socket.id, user));
    // const router = await createRoom(meetingId, socket.id)

    // console.log('users in joinroom before: ', users[meetingId]);

    // console.log(newUser);
    if(rooms[meetingId] && users[meetingId]) {
      const userExists = users[meetingId].some(
        (existingUser) => existingUser.socketId === socket.id
      );
    
      if (!userExists) {
        // Add the user to the users array
        users[meetingId].push({
          socketId: socket.id,
          ...user,
        });
      }
    }

    // console.log('users in joinroom: ', users[meetingId]);

    socket.join(meetingId);

    peers[socket.id] = {
      socket,
      meetingId, //? Name for the Router this Peer joined
      transports: [],
      producers: [],
      consumers: [],
      peerDetails: {
        name: "",
        isAdmin: false, //? Is this Peer the Admin?
      },
    };

    // console.log("Rooms in join room: ", rooms);
    // console.log("Peers in join room: ", peers);

    //? get Router RTP Capabilities
    const rtpCapabilities = router.rtpCapabilities;

    //? call callback from the client and send back the rtpCapabilities
    callback({ rtpCapabilities });
  });

  socket.on('new-user', ({ meetingId }) => {

    meetSocket.to(meetingId).emit('joined-users', { users: users[meetingId] } )
  })

  socket.on("createWebRtcTransport", async ({ consumer }, callback) => {
    // get Room Name from Peer's properties
    const meetingId = peers[socket.id].meetingId;

    // get Router (Room) object this peer is in based on meetingId
    const router = rooms[meetingId].router;

    createWebRtcTransport(router).then(
      (transport) => {
        callback({
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          },
        });

        // add transport to Peer's properties
        addTransport(transport, meetingId, consumer);
      },
      (error) => {
        console.log(error);
      }
    );
  });

  socket.on("getProducers", (callback) => {
    //return all producer transports
    const { meetingId } = peers[socket.id];

    let producerList = [];
    // console.log("Producers: ", producers);
    producers.forEach((producerData) => {
      if (
        producerData.socketId !== socket.id &&
        producerData.meetingId === meetingId
      ) {
        producerList = [...producerList, producerData.producer.id];
      }
    });

    // console.log("producerList: ", producerList);

    // return the producer list back to the client
    callback(producerList);
  });

  // see client's socket.emit('transport-connect', ...)
  socket.on("transport-connect", ({ dtlsParameters }) => {
    console.log("DTLS PARAMS... ", { dtlsParameters });

    getTransport(socket.id).connect({ dtlsParameters });
  });

  // see client's socket.emit('transport-produce', ...)
  socket.on(
    "transport-produce",
    async ({ kind, rtpParameters, appData }, callback) => {
      // call produce based on the prameters from the client
      const producer = await getTransport(socket.id).produce({
        kind,
        rtpParameters,
      });

      // add producer to the producers array
      const { meetingId } = peers[socket.id];

      addProducer(producer, meetingId);

      informConsumers(meetingId, socket.id, producer.id);

      console.log("Producer ID: ", producer.id, producer.kind);

      producer.on("transportclose", () => {
        console.log("transport for this producer closed ");
        producer.close();
      });

      // Send back to the client the Producer's id
      callback({
        id: producer.id,
        producersExist: producers.length > 1 ? true : false,
      });
    }
  );

  // see client's socket.emit('transport-recv-connect', ...)
  socket.on(
    "transport-recv-connect",
    async ({ dtlsParameters, serverConsumerTransportId }) => {
      console.log("DTLS PARAMS: ", { dtlsParameters });
      const consumerTransport = transports.find(
        (transportData) =>
          transportData.consumer &&
          transportData.transport.id == serverConsumerTransportId
      ).transport;
      await consumerTransport.connect({ dtlsParameters });
    }
  );

  socket.on(
    "consume",
    async (
      { rtpCapabilities, remoteProducerId, serverConsumerTransportId },
      callback
    ) => {
      try {
        const { meetingId } = peers[socket.id];
        const router = rooms[meetingId].router;
        const consumerTransport = transports.find(
          (transportData) =>
            transportData.consumer &&
            transportData.transport.id == serverConsumerTransportId
        ).transport;

        // check if the router can consume the specified producer
        if (
          router.canConsume({
            producerId: remoteProducerId,
            rtpCapabilities,
          })
        ) {
          console.log("Router can consume...");
          // transport can now consume and return a consumer
          const consumer = await consumerTransport.consume({
            producerId: remoteProducerId,
            rtpCapabilities,
            paused: true,
          });

          consumer.on("transportclose", () => {
            console.log("transport close from consumer");
          });

          consumer.on("producerclose", () => {
            console.log("producer of consumer closed");
            socket.emit("producer-closed", { remoteProducerId });

            consumerTransport.close([]);
            transports = transports.filter(
              (transportData) =>
                transportData.transport.id !== consumerTransport.id
            );
            consumer.close();
            consumers = consumers.filter(
              (consumerData) => consumerData.consumer.id !== consumer.id
            );
          });

          addConsumer(consumer, meetingId);

          // from the consumer extract the following params
          // to send back to the Client
          const params = {
            id: consumer.id,
            producerId: remoteProducerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            serverConsumerId: consumer.id,
          };

          // send the parameters to the client
          callback({ params });
        }
      } catch (error) {
        console.log(error.message);
        callback({
          params: {
            error: error,
          },
        });
      }
    }
  );

  socket.on("consumer-resume", async ({ serverConsumerId, meetingId }) => {
    const { consumer } = consumers.find(
      (consumerData) => consumerData.consumer.id === serverConsumerId
    );
    await consumer.resume();
    console.log("consumer resume");

    // console.log(rooms[meetingId]?.peers);
  });

  // socket.on("screenShareToggle", async ({ enabled }) => {

  //   console.log('screenShareToggel listened...');

  //   const { meetingId } = peers[socket.id];

  //   // Notify other peers in the meeting about screen sharing toggle
  //   socket
  //     .to(meetingId)
  //     .emit("screenShareToggle", { socketId: socket.id, enabled });

  //   // If screen sharing is enabled, create a new producer for the screen
  //   if (enabled) {
  //     const router = rooms[meetingId].router;
  //     const screenTransport = await createScreenSharingTransport(router);

  //     const screenProducer = await screenTransport.produce({
  //       kind: "video",
  //       rtpParameters: {
  //         mid: "1",
  //         codecs: screenSharingCodecs, // Only VP8 for screen sharing
  //         encodings: [{ rid: "r0", maxBitrate: 100000 }],
  //         codecOptions: { videoGoogleStartBitrate: 1000 },
  //       },
  //       codecOptions: {
  //         videoGoogleStartBitrate: 1000,
  //       },
  //     });

  //     addTransport(screenTransport, meetingId, true);

  //     addProducer(screenProducer, meetingId);

  //     informConsumers(meetingId, socket.id, screenProducer.id);
  //   }
  //   // If screen sharing is disabled, close the screen producer and transport
  //   else {
  //     const screenProducer = producers.find(
  //       (producer) =>
  //         producer.socketId === socket.id && producer.kind === "video"
  //     );
  //     if (screenProducer) {
  //       const screenTransport = transports.find(
  //         (transport) => transport.socketId === socket.id && transport.consumer
  //       );
  //       if (screenTransport) {
  //         screenTransport.transport.close();
  //       }
  //       screenProducer.producer.close();
  //     }
  //   }
  // });

  //? Listen for the disconnect event..
  socket.on("disconnect", () => {
    //? do some cleanup

    consumers = removeItems(consumers, socket.id, "consumer");
    producers = removeItems(producers, socket.id, "producer");
    transports = removeItems(transports, socket.id, "transport");

    console.log("socket.id: ", socket.id);
    console.log(peers[socket.id]);

    const { meetingId } = peers[socket.id];

    // socket.leave()

    delete peers[socket.id];

    users[meetingId] = users[meetingId].filter(
      (user) => user.socketId !== socket.id
    );  

    //? remove socket from room
    rooms[meetingId] = {
      router: rooms[meetingId].router,
      peers: rooms[meetingId].peers.filter(
        (socketId) => socketId !== socket.id
      ),
    };
    console.log("peer disconnected");
  });
}

module.exports = {
  mediasoupProcess,
};
