// ระบบการ์ด "ยกเลิก" เพื่อขัดจังหวะกลยุทธ์

// เพิ่ม global action stack
let actionStack = [];
// เพิ่มการ์ดกลยุทธ์พิเศษ: มีสุขลืมเมือง, เก็บเกี่ยว

// เพิ่มระบบไพ่หน่วงเวลา: สายฟ้า / ขาดเสบียง / ขี้เกียจ
// เพิ่มระบบตายถาวรและเปิดบทบาท พร้อมเช็กผลพิเศษ

// ระบบเต็ม War of the Three Kingdoms (WTK) - เพิ่มระบบหลบหลีกจากการโจมตี
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


const SUITS = ["♥", "♦", "♣", "♠"];
const COLORS = { "♥": "red", "♦": "red", "♣": "black", "♠": "black" };

const FULL_DECK = [
  "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี",
  "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี",
  "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี", "โจมตี",
  "หลบหลีก", "หลบหลีก", "หลบหลีก", "หลบหลีก", "หลบหลีก", "หลบหลีก", "หลบหลีก", "หลบหลีก", "หลบหลีก", "หลบหลีก",
  "หลบหลีก", "หลบหลีก", "หลบหลีก", "หลบหลีก", "หลบหลีก",
  "ฟื้นพลัง", "ฟื้นพลัง", "ฟื้นพลัง", "ฟื้นพลัง", "ฟื้นพลัง", "ฟื้นพลัง", "ฟื้นพลัง", "ฟื้นพลัง", "ฟื้นพลัง", "ฟื้นพลัง",
  "ฟื้นพลัง", "ฟื้นพลัง",
  "สุรา", "สุรา", "สุรา", "สุรา", "สุรา",
  "ดวล", "ดวล", "ดวล",
  "ขโมย", "ขโมย", "ขโมย", "ขโมย", "ขโมย",
  "บังคับ", "บังคับ",
  "เกาทัณฑ์พันดอก", "เกาทัณฑ์พันดอก", "เกาทัณฑ์พันดอก",
  "เรือระเบิดเพลิง", "เรือระเบิดเพลิง", "เรือระเบิดเพลิง",
  "มีสุขลืมเมือง",
  "เก็บเกี่ยว", "เก็บเกี่ยว",
  "ยกเลิก", "ยกเลิก", "ยกเลิก",
  "ไฟไหม้", "ไฟไหม้", "ไฟไหม้",
  "โซ่ตรวน", "โซ่ตรวน", "โซ่ตรวน", "โซ่ตรวน", "โซ่ตรวน", "โซ่ตรวน",
  "หอกง้าว", "ดาบของลิโป้", "พัดขนนก", "กระบี่ทองคำ", "ดาบทมิฬ", "มีดบิน", "ทวนของกวนอู", "กระบี่สองคม", "ค้อนลับ", "ดาบอสรพิษ", "พลองเหล็ก", "ธนูยาว",
  "เกราะเต่า", "เกราะเหล็ก", "เสื้อหนัง", "โล่กลยุทธ์",
  "เซ็กเธาว์", "ม้าเทา", "ม้าราตรี",
  "ชิวลู่", "ลมกรด", "ดำเงา",
  "สายฟ้า", "ขาดเสบียง", "ขาดเสบียง",
  "ขี้เกียจ", "ขี้เกียจ", "ขี้เกียจ"
]; // TODO: เพิ่มไพ่ทั้งหมดภายหลัง

const HERO_POOL = [
  {
    name: "ไต้เกี้ยว",
    hp: 3,
    skills: [
      "ใช้การ์ดข้าวหลามตัดแทน 'มีสุขลืมเมือง'",
      "ทิ้งการ์ด 1 ใบ เพื่อเปลี่ยนเป้าหมายของการ์ด 'โจมตี' ที่มุ่งมาทางคุณ ไปยังผู้เล่นอื่นในระยะ"
    ]
  },
  {
    name: "ฮัวหยง",
    hp: 6,
    skills: [
      "ขุนพลที่โจมตีคุณได้สำเร็จ จะเลือกฟื้น 1 HP หรือจั่ว 1 ใบ"
    ]
  },
  {
    name: "กุยแก",
    hp: 3,
    skills: [
      "เมื่อเปิดไพ่ตัดสิน คุณจะได้รับไพ่ที่เปิด",
      "หลังจากได้รับ DMG หยิบ 2 ใบจากสำรับ มอบให้ผู้เล่นใดก็ได้"
    ]
  },
  {
    name: "เอียนสี",
    hp: 3,
    skills: [
      "สามารถใช้ไพ่ดอกจิก/โพดำแทน 'หลบหลีก'",
      "เปิดไพ่ตัดสินตอนเริ่มเทิร์น ถ้าเป็นสีดำ เก็บไว้ใช้ในรอบนั้นได้"
    ]
  },
  {
    name: "สุมาอี้",
    hp: 3,
    skills: [
      "เมื่อได้รับ DMG เลือกหยิบการ์ด 1 ใบจากผู้โจมตี",
      "สามารถทิ้งไพ่ในมือเพื่อใช้แทนไพ่ตัดสินของตนหรือผู้อื่นได้"
    ]
  },
  {
    name: "จูล่ง",
    hp: 4,
    skills: [
      "ใช้ 'โจมตี' แทน 'หลบหลีก' และใช้ 'หลบหลีก' แทน 'โจมตี'"
    ]
  },
  {
    name: "หวงเย่อิง",
    hp: 3,
    skills: [
      "เมื่อใช้การ์ดกลยุทธ์ สามารถจั่วการ์ด 1 ใบ",
      "ใช้การ์ดกลยุทธ์ได้ไม่จำกัดระยะ"
    ]
  },
  {
    name: "ฮัวโต๋",
    hp: 3,
    skills: [
      "ใช้การ์ดแดงแทน 'ฟื้นพลัง' (นอกเทิร์น)",
      "ทิ้งการ์ด 1 ใบเพื่อฟื้น 1 HP ให้ใครก็ได้ (รอบละ 1 ครั้ง)"
    ]
  },
  {
    name: "แฮหัวตุ้น",
    hp: 4,
    skills: [
      "เมื่อได้รับ DMG เปิดไพ่ตัดสิน ถ้าไม่ใช่หัวใจ ศัตรูต้องทิ้ง 2 ใบหรือเสีย 1 HP"
    ]
  }
];

let rooms = {};

io.on("connection", (socket) => {
  console.log("เชื่อมต่อแล้ว:", socket.id);

  socket.on("join_game", ({ name, room }) => {
    if (!rooms[room]) rooms[room] = createRoom(room);
    const player = createPlayer(socket.id, name);
    rooms[room].players.push(player);
    socket.join(room);
    io.to(room).emit("players_update", rooms[room].players);

    if (rooms[room].players.length >= 4 && !rooms[room].started) {
      startGame(rooms[room]);
    }
  });

  socket.on("end_turn", () => {
    const room = getRoomBySocket(socket.id);
    if (!room || room.players[room.turn].id !== socket.id) return;
    advanceTurn(room);
  });

  socket.on("play_card", ({ card, targetId }) => {
    const room = getRoomBySocket(socket.id);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (!player || room.players[room.turn].id !== socket.id || player.dead) return;

    if (!player.hand.includes(card)) return;
    player.hand.splice(player.hand.indexOf(card), 1);

    // การ์ดติดตั้ง
    const EQUIPMENT_TYPES = {
      "หอกง้าว": "weapon",
      "ดาบของลิโป้": "weapon",
      "พัดขนนก": "weapon",
      "กระบี่ทองคำ": "weapon",
      "ดาบทมิฬ": "weapon",
      "มีดบิน": "weapon",
      "ทวนของกวนอู": "weapon",
      "กระบี่สองคม": "weapon",
      "ค้อนลับ": "weapon",
      "ดาบอสรพิษ": "weapon",
      "พลองเหล็ก": "weapon",
      "ธนูยาว": "weapon",
      "เกราะเต่า": "armor",
      "เกราะเหล็ก": "armor",
      "เสื้อหนัง": "armor",
      "โล่กลยุทธ์": "armor",
      "เซ็กเธาว์": "horsePlus",
      "ม้าเทา": "horsePlus",
      "ม้าราตรี": "horsePlus",
      "ชิวลู่": "horseMinus",
      "ลมกรด": "horseMinus",
      "ดำเงา": "horseMinus"
    };

    const type = EQUIPMENT_TYPES[card];
    if (type) {
      if (player.equipment[type]) {
        room.discard.push(player.equipment[type]);
      }
      player.equipment[type] = { name: card, range: getCardRange(card) };
      room.discard.push(card);
      io.to(room.id).emit("players_update", room.players);
      return;
    }

    room.discard.push(card);

    if (card === "ฟื้นพลัง") {
      if (targetId) {
        const target = room.players.find(p => p.id === targetId);
        if (!target || target.dead) return;
        target.hp = Math.min(target.maxHp, target.hp + 1);
        io.to(room.id).emit("log", `${player.name} ฟื้นพลังให้ ${target.name}`);
      } else {
        player.hp = Math.min(player.maxHp, player.hp + 1);
        io.to(room.id).emit("log", `${player.name} ฟื้นพลังตัวเอง`);
      }
      room.discard.push(card);
      io.to(room.id).emit("players_update", room.players);
      return;
    }

    if (card === "สุรา") {
      if (player.hp <= 0) {
        player.hp = 1;
        io.to(room.id).emit("log", `${player.name} ใช้สุราเพื่อรอดชีวิต!`);
      } else {
        player.nextAttackBoost = true; // จะทำให้โจมตีครั้งถัดไปแรงขึ้น
        io.to(room.id).emit("log", `${player.name} ใช้สุรา เตรียมโจมตีแรงขึ้น`);
      }
      room.discard.push(card);
      io.to(room.id).emit("players_update", room.players);
      return;
    }

    if (card === "โจมตี") {
      const target = room.players.find(p => p.id === targetId);
      if (!target || target.dead) return;

      const attackerIndex = room.players.findIndex(p => p.id === player.id);
      const targetIndex = room.players.findIndex(p => p.id === target.id);
      const distance = getDistance(room.players, attackerIndex, targetIndex);
      const attackRange = getAttackRange(player);
      if (distance > attackRange) {
        io.to(player.id).emit("log", "เป้าหมายอยู่นอกระยะโจมตี");
        return;
      }

      room.pendingAttack = { from: player.id, to: target.id };
      io.to(target.id).emit("attack_incoming", { from: player.name });
    }
  });

  socket.on("use_heal_on_dying", () => {
      const room = getRoomBySocket(socket.id);
      if (!room || !room.dying) return;
      const target = room.players.find(p => p.id === room.dying);
      if (!target || target.dead) return;
  
      const healer = room.players.find(p => p.id === socket.id);
      const healCard = healer.hand.find(c => c === "ฟื้นพลัง" || c === "สุรา");
      if (!healCard) return;
  
      healer.hand.splice(healer.hand.indexOf(healCard), 1);
      room.discard.push(healCard);
  
      target.hp = 1;
      room.dying = null;
  
      io.to(room.id).emit("log", `${healer.name} ช่วย ${target.name} รอดจากความตายด้วย ${healCard}`);
      io.to(room.id).emit("players_update", room.players);
      advanceTurn(room);
    });
  
  socket.on("defend_result", ({ success }) => {
    const room = getRoomBySocket(socket.id);
    if (!room || !room.pendingAttack) return;
  
    const { from, to } = room.pendingAttack;
    if (to !== socket.id) return;
  
    const target = room.players.find(p => p.id === to);
    const attacker = room.players.find(p => p.id === from);
    if (!target || !attacker || target.dead) return;
  
    if (!success) {
      target.hp -= 1;
      if (target.hp <= 0) {
        target.dead = true;
        room.dying = target.id;
        io.to(room.id).emit("dying", { name: target.name });
        io.to(room.id).emit("player_dead", { name: target.name, role: target.role });
      }
    } else {
      room.discard.push("หลบหลีก");
    }
  
    room.pendingAttack = null;
    if (!room.dying) advanceTurn(room);
    io.to(room.id).emit("players_update", room.players);
  });
  
         socket.on("defend_result", ({ success }) => {
    const room = getRoomBySocket(socket.id);
    if (!room || !room.pendingAttack) return;
  
    const { from, to } = room.pendingAttack;
    if (to !== socket.id) return;
  
    const target = room.players.find(p => p.id === to);
    const attacker = room.players.find(p => p.id === from);
    if (!target || !attacker || target.dead) return;
  
    if (!success) {
      target.hp -= 1;
      if (target.hp <= 0) {
        room.dying = target.id;
        io.to(room.id).emit("dying", { name: target.name });
      }
    } else {
      room.discard.push("หลบหลีก");
    }
  
    room.pendingAttack = null;
    if (!room.dying) advanceTurn(room);
    io.to(room.id).emit("players_update", room.players);
  });
  
  
  function createRoom(roomId) {
    return {
      id: roomId,
      players: [],
      deck: shuffle([...FULL_DECK]),
      discard: [],
      turn: 0,
      started: false,
      log: [],
      emperor: null,
      pendingAttack: null,
      dying: null
    };
  }
  
  function createPlayer(id, name) {
    return {
      id,
      name,
      role: null,
      hero: null,
      hp: 4,
      maxHp: 4,
      hand: [],
      equipment: { weapon: null, armor: null, horsePlus: null, horseMinus: null },
      chained: false,
      delayed: [],
      dead: false
    };
  }
  
  function startGame(room) {
    room.started = true;
    const count = room.players.length;
    const roles = getRolesByCount(count);
    const heroes = shuffle([...HERO_POOL]);
  
    room.players.forEach((p, i) => {
      p.role = roles[i];
      p.hero = heroes[i % heroes.length].name;
      p.hp = heroes[i % heroes.length].hp;
      p.maxHp = p.hp;
      p.hand = drawCards(room, 4);
      if (p.role === "จักรพรรดิ" && count >= 4) p.hp += 1;
      if (p.role === "จักรพรรดิ") room.emperor = p.name;
  
      io.to(p.id).emit("your_data", { role: p.role === "จักรพรรดิ" ? p.role : "???", hero: p.hero, hp: p.hp, hand: p.hand });
    });
  
    io.to(room.id).emit("start_game", { emperor: room.emperor });
    nextTurn(room);
  }
  
  function getRolesByCount(count) {
    const table = {
      4: { emperor: 1, loyal: 0, rebel: 2, traitor: 1 },
      5: { emperor: 1, loyal: 1, rebel: 2, traitor: 1 },
      6: { emperor: 1, loyal: 1, rebel: 2, traitor: 2 },
      7: { emperor: 1, loyal: 1, rebel: 3, traitor: 2 },
      8: { emperor: 1, loyal: 2, rebel: 3, traitor: 2 },
      9: { emperor: 1, loyal: 2, rebel: 4, traitor: 2 },
      10: { emperor: 1, loyal: 2, rebel: 4, traitor: 3 }
    };
    const r = table[count];
    const roles = [];
    if (!r) return roles;
    roles.push(...Array(r.emperor).fill("จักรพรรดิ"));
    roles.push(...Array(r.loyal).fill("ภักดี"));
    roles.push(...Array(r.rebel).fill("กบฏ"));
    roles.push(...Array(r.traitor).fill("ทรยศ"));
    return shuffle(roles);
  }
  
  function drawCards(room, n) {
    const drawn = [];
    while (drawn.length < n) {
      if (room.deck.length === 0) {
        room.deck = shuffle([...room.discard]);
        room.discard = [];
      }
      if (room.deck.length === 0) break; // ป้องกัน deck ว่างหมด
      drawn.push(room.deck.shift());
    }
    return drawn;
  }
  
  function nextTurn(room) {
    let current = room.players[room.turn];
    if (current.dead) {
      advanceTurn(room);
      return;
    }
  
    const drawn = drawCards(room, 2);
    current.hand.push(...drawn);
    io.to(current.id).emit("turn_start", { hand: current.hand, drawn });
    io.to(room.id).emit("turn_info", { currentPlayer: current.name });
  }
  
  function advanceTurn(room) {
    do {
      room.turn = (room.turn + 1) % room.players.length;
    } while (room.players[room.turn].dead);
    nextTurn(room);
  }
  
  function getRoomBySocket(socketId) {
    for (const id in rooms) {
      if (rooms[id].players.some(p => p.id === socketId)) return rooms[id];
    }
    return null;
  }
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function getAttackRange(player) {
    let range = 1;
    if (player.equipment.weapon) range = player.equipment.weapon.range;
    if (player.equipment.horsePlus) range += 1;
    if (player.equipment.horseMinus) range -= 1;
    return Math.max(1, range);
  }
  
  function getDistance(players, fromIndex, toIndex) {
    const len = players.length;
    let cw = 0, ccw = 0;
    for (let i = 1; i < len; i++) {
      if (players[(fromIndex + i) % len].dead) continue;
      cw++;
      if ((fromIndex + i) % len === toIndex) break;
    }
    for (let i = 1; i < len; i++) {
      const idx = (fromIndex - i + len) % len;
      if (players[idx].dead) continue;
      ccw++;
      if (idx === toIndex) break;
    }
    return Math.min(cw, ccw);
  }
  
  function getCardRange(card) {
    const rangeMap = {
      "หอกง้าว": 3,
      "ดาบของลิโป้": 1,
      "พัดขนนก": 4,
      "กระบี่ทองคำ": 4,
      "ดาบทมิฬ": 3,
      "มีดบิน": 3,
      "ทวนของกวนอู": 4,
      "กระบี่สองคม": 2,
      "ค้อนลับ": 3,
      "ดาบอสรพิษ": 2,
      "พลองเหล็ก": 3,
      "ธนูยาว": 5
    };
    return rangeMap[card] || 0;
  }
  
  function killPlayer(room, player) {
    if (player.dead) return;
    player.dead = true;
    io.to(room.id).emit("player_dead", { name: player.name, role: player.role });
  
    const killer = room.players[room.turn];
    if (!killer || killer.dead || killer.id === player.id) return;
  
    // กรณีฆ่าภักดีโดยจักรพรรดิ → โทษ
    if (killer.role === "จักรพรรดิ" && player.role === "ภักดี") {
      killer.hand = [];
      killer.equipment = { weapon: null, armor: null, horsePlus: null, horseMinus: null };
      io.to(room.id).emit("log", `จักรพรรดิ (${killer.name}) ฆ่าภักดีโดยไม่ตั้งใจ ต้องทิ้งไพ่และอุปกรณ์ทั้งหมด`);
    }
  
    // กรณีฆ่ากบฏได้ → จั่วเพิ่ม 3 ใบ
    if (player.role === "กบฏ") {
      const bonus = drawCards(room, 3);
      killer.hand.push(...bonus);
      io.to(room.id).emit("log", `${killer.name} ฆ่ากบฏได้ รับไพ่เพิ่ม 3 ใบ`);
    }
  
    checkGameEnd(room);
  }
  
  function checkGameEnd(room) {
    const alive = room.players.filter(p => !p.dead);
    const emperor = room.players.find(p => p.role === "จักรพรรดิ");
  
    if (!emperor || emperor.dead) {
      const traitor = alive.find(p => p.role === "ทรยศ");
      if (traitor && alive.length === 1) {
        io.to(room.id).emit("log", `ผู้ชนะคือ ทรยศ (${traitor.name})`);
      } else {
        io.to(room.id).emit("log", `ฝ่ายกบฏชนะ!`);
      }
      return;
    }
  
    const enemies = alive.filter(p => p.role === "กบฏ" || p.role === "ทรยศ");
    if (enemies.length === 0) {
      io.to(room.id).emit("log", `ฝ่ายจักรพรรดิชนะ!`);
    }
  }
  
  // ใน event use_heal_on_dying: หากไม่มีคนช่วย → ตายถาวร
  socket.on("use_heal_on_dying", () => {
    const room = getRoomBySocket(socket.id);
    if (!room || !room.dying) return;
    const target = room.players.find(p => p.id === room.dying);
    if (!target || target.dead) return;
  
    const healer = room.players.find(p => p.id === socket.id);
    const healCard = healer.hand.find(c => c === "ฟื้นพลัง" || c === "สุรา");
    if (!healCard) return;
  
    healer.hand.splice(healer.hand.indexOf(healCard), 1);
    room.discard.push(healCard);
  
    target.hp = 1;
    room.dying = null;
  
    io.to(room.id).emit("log", `${healer.name} ช่วย ${target.name} รอดจากความตายด้วย ${healCard}`);
    io.to(room.id).emit("players_update", room.players);
    advanceTurn(room);
  });
  
  // เพิ่ม fallback: หากไม่มีใครช่วยภายใน 10 วิ
  setInterval(() => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (room.dying) {
        const player = room.players.find(p => p.id === room.dying);
        if (player) {
          io.to(room.id).emit("log", `${player.name} ไม่ได้รับความช่วยเหลือ และเสียชีวิต`);
          room.dying = null;
          killPlayer(room, player);
          advanceTurn(room);
        }
      }
    }
  }, 10000);
  // เพิ่มระบบการ์ดกลยุทธ์หมู่: เกาทัณฑ์พันดอก และ เรือระเบิดเพลิง
  
  // ...โค้ดก่อนหน้านี้คงเดิม
  
  socket.on("play_card", ({ card, targetId }) => {
    const room = getRoomBySocket(socket.id);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (!player || room.players[room.turn].id !== socket.id || player.dead) return;
  
    if (!player.hand.includes(card)) return;
    player.hand.splice(player.hand.indexOf(card), 1);
    room.discard.push(card);
  
    if (card === "เกาทัณฑ์พันดอก" || card === "เรือระเบิดเพลิง") {
      const needCard = card === "เกาทัณฑ์พันดอก" ? "โจมตี" : "หลบหลีก";
      room.massAction = {
        from: player.id,
        card,
        needCard,
        pending: room.players.filter(p => p.id !== player.id && !p.dead).map(p => p.id)
      };
  
      room.massAction.pending.forEach(pid => {
        io.to(pid).emit("mass_response", { type: card, need: needCard });
      });
  
      setTimeout(() => {
        if (!room.massAction) return;
        room.massAction.pending.forEach(pid => handleMassFail(room, pid));
        room.massAction = null;
        io.to(room.id).emit("players_update", room.players);
      }, 8000); // ให้เวลาตอบ 8 วินาที
      return;
    }
  
    // ...การ์ดอื่น ๆ
  });
  
  socket.on("mass_result", ({ success }) => {
    const room = getRoomBySocket(socket.id);
    if (!room || !room.massAction) return;
    if (!room.massAction.pending.includes(socket.id)) return;
  
    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;
  
    const idx = player.hand.indexOf(room.massAction.needCard);
    if (success && idx !== -1) {
      player.hand.splice(idx, 1);
      room.discard.push(room.massAction.needCard);
      io.to(room.id).emit("log", `${player.name} ใช้ ${room.massAction.needCard} เพื่อตอบสนอง ${room.massAction.card}`);
    } else {
      handleMassFail(room, socket.id);
    }
  
    room.massAction.pending = room.massAction.pending.filter(id => id !== socket.id);
  
    if (room.massAction.pending.length === 0) {
      room.massAction = null;
      io.to(room.id).emit("players_update", room.players);
    }
  });
  
  function handleMassFail(room, pid) {
    const player = room.players.find(p => p.id === pid);
    if (!player || player.dead) return;
    player.hp--;
    io.to(room.id).emit("log", `${player.name} ไม่มี ${room.massAction.needCard} → เสีย 1 HP`);
    if (player.hp <= 0) {
      room.dying = player.id;
      io.to(room.id).emit("dying", { name: player.name });
    }
  }
  // เพิ่มระบบการ์ดกลยุทธ์แบบเลือกเป้าหมาย: ขโมย, ดวล
  
  // ใน play_card ด้านใน...
  
  if (card === "ขโมย") {
    const target = room.players.find(p => p.id === targetId);
    if (!target || target.dead) return;
  
    const attackerIndex = room.players.findIndex(p => p.id === player.id);
    const targetIndex = room.players.findIndex(p => p.id === target.id);
    const distance = getDistance(room.players, attackerIndex, targetIndex);
    const attackRange = getAttackRange(player);
    if (distance > attackRange) {
      io.to(player.id).emit("log", "เป้าหมายอยู่นอกระยะ ไม่สามารถขโมยได้");
      return;
    }
  
    const totalCards = [...target.hand];
    if (target.equipment.weapon) totalCards.push(target.equipment.weapon.name);
    if (target.equipment.armor) totalCards.push(target.equipment.armor.name);
    if (totalCards.length === 0) {
      io.to(player.id).emit("log", `${target.name} ไม่มีการ์ดให้ขโมย`);
      return;
    }
  
    const stolen = totalCards[Math.floor(Math.random() * totalCards.length)];
    player.hand.push(stolen);
    const hIdx = target.hand.indexOf(stolen);
    if (hIdx !== -1) {
      target.hand.splice(hIdx, 1);
    } else {
      if (target.equipment.weapon?.name === stolen) target.equipment.weapon = null;
      if (target.equipment.armor?.name === stolen) target.equipment.armor = null;
    }
    io.to(room.id).emit("log", `${player.name} ขโมยการ์ดจาก ${target.name}`);
    io.to(room.id).emit("players_update", room.players);
    return;
  }
  
  if (card === "ดวล") {
    const target = room.players.find(p => p.id === targetId);
    if (!target || target.dead) return;
    room.duel = { attacker: player.id, defender: target.id, turn: player.id };
    io.to(room.id).emit("log", `${player.name} ท้าดวล ${target.name}`);
    io.to(target.id).emit("duel_request", { from: player.name });
    return;
  }
  
  // เพิ่ม socket สำหรับการตอบรับดวล
  socket.on("duel_response", ({ useAttack }) => {
    const room = getRoomBySocket(socket.id);
    if (!room || !room.duel) return;
    const duel = room.duel;
    const player = room.players.find(p => p.id === socket.id);
    if (!player || player.id !== duel.turn) return;
  
    if (useAttack) {
      const idx = player.hand.indexOf("โจมตี");
      if (idx !== -1) {
        player.hand.splice(idx, 1);
        room.discard.push("โจมตี");
        duel.turn = player.id === duel.attacker ? duel.defender : duel.attacker;
        const next = room.players.find(p => p.id === duel.turn);
        io.to(next.id).emit("duel_request", { from: player.name });
        return;
      }
    }
  
    // ถ้าไม่ตอบ หรือไม่มีโจมตี → แพ้ดวล
    player.hp--;
    io.to(room.id).emit("log", `${player.name} แพ้ดวล เสีย 1 HP`);
    room.duel = null;
    if (player.hp <= 0) {
      room.dying = player.id;
      io.to(room.id).emit("dying", { name: player.name });
    } else {
      io.to(room.id).emit("players_update", room.players);
    }
  });
  
  function processDelayedCards(room, player) {
    const toRemove = [];
  
    for (const card of player.delayed || []) {
      const suit = randomSuit();
      const number = Math.floor(Math.random() * 13) + 1;
      const full = `${suit}${number}`;
      io.to(room.id).emit("log", `${player.name} ตัดสินไพ่ ${card} ได้ ${full}`);
  
      if (card === "สายฟ้า") {
        if (suit === "♠" && number >= 2 && number <= 9) {
          player.hp -= 3;
          io.to(room.id).emit("log", `${player.name} โดนสายฟ้า ฟาด -3 HP`);
          if (player.hp <= 0) {
            room.dying = player.id;
            io.to(room.id).emit("dying", { name: player.name });
          }
        } else {
          // ส่งต่อ
          const idx = room.players.findIndex(p => p.id === player.id);
          for (let i = 1; i < room.players.length; i++) {
            const next = room.players[(idx + i) % room.players.length];
            if (!next.dead) {
              next.delayed = next.delayed || [];
              next.delayed.push("สายฟ้า");
              io.to(room.id).emit("log", `สายฟ้าถูกส่งต่อไปยัง ${next.name}`);
              break;
            }
          }
          toRemove.push("สายฟ้า");
        }
      }
  
      if (card === "ขาดเสบียง") {
        if (suit !== "♣") {
          io.to(room.id).emit("log", `${player.name} ขาดเสบียง → ข้ามเฟสดรอว์`);
          player.skipDraw = true;
        }
        toRemove.push("ขาดเสบียง");
      }
  
      if (card === "ขี้เกียจ") {
        if (suit !== "♣") {
          io.to(room.id).emit("log", `${player.name} ขี้เกียจ → ข้ามดรอว์และเล่นไพ่`);
          player.skipDraw = true;
          player.skipPlay = true;
        }
        toRemove.push("ขี้เกียจ");
      }
    }
  
    player.delayed = player.delayed.filter(c => !toRemove.includes(c));
  }
  
  function randomSuit() {
    const suits = ["♠", "♥", "♦", "♣"];
    return suits[Math.floor(Math.random() * 4)];
  }
  
  // ใน nextTurn ก่อนจั่ว
  function nextTurn(room) {
    while (room.players[room.turn].dead) {
      room.turn = (room.turn + 1) % room.players.length;
    }
    const currentPlayer = room.players[room.turn];
  
    currentPlayer.skipDraw = false;
    currentPlayer.skipPlay = false;
  
    processDelayedCards(room, currentPlayer);
  
    if (!room.dying && !currentPlayer.skipDraw) {
      currentPlayer.hand.push(...drawCards(room, 2));
    }
  
    room.players.forEach(p => io.to(p.id).emit("turn", p.id === currentPlayer.id));
    io.to(currentPlayer.id).emit("log", "ถึงตาคุณเล่นแล้ว! กรุณาเลือกการ์ดและเป้าหมาย");
  }
  
  // เพิ่มใน play_card: ใช้ไพ่หน่วงเวลา
  if (["สายฟ้า", "ขาดเสบียง", "ขี้เกียจ"].includes(card)) {
    const target = room.players.find(p => p.id === targetId);
    if (!target || target.dead) return;
    target.delayed = target.delayed || [];
    target.delayed.push(card);
    io.to(room.id).emit("log", `${player.name} ใช้ไพ่ ${card} กับ ${target.name}`);
    return;
  }
  
  
  if (card === "มีสุขลืมเมือง") {
    room.players.forEach(p => {
      if (!p.dead) {
        p.hp = Math.min(p.maxHp || 4, p.hp + 1);
      }
    });
    io.to(room.id).emit("log", `${player.name} ใช้ มีสุขลืมเมือง ฟื้นพลังทุกคน`);
    io.to(room.id).emit("players_update", room.players);
    return;
  }
  
  if (card === "เก็บเกี่ยว") {
    const draw = drawCards(room, 5);
    const alive = room.players.filter(p => !p.dead);
    const startIdx = alive.findIndex(p => p.id === player.id);
    for (let i = 0; i < draw.length; i++) {
      const target = alive[(startIdx + i) % alive.length];
      target.hand.push(draw[i]);
      io.to(room.id).emit("log", `${target.name} ได้การ์ดจากเก็บเกี่ยว (${draw[i]})`);
    }
    io.to(room.id).emit("players_update", room.players);
    return;
  }
  
  // ภายใน play_card: เมื่อเป็นกลยุทธ์ที่ขัดขวางได้
  if (["ดวล", "ขโมย", "เกาทัณฑ์พันดอก", "เรือระเบิดเพลิง", "มีสุขลืมเมือง", "เก็บเกี่ยว"].includes(card)) {
    actionStack.push({ roomId: room.id, playerId: socket.id, card, targetId });
    room.players.forEach(p => {
      if (!p.dead && p.id !== socket.id) {
        io.to(p.id).emit("can_cancel", { from: player.name, card });
      }
    });
    setTimeout(() => {
      const current = actionStack.shift();
      if (current && current.card === card && current.playerId === socket.id) {
        executeCardEffect(card, room, player, targetId);
      }
    }, 5000); // ให้เวลาขัดขวาง 5 วิ
    return;
  }
  
  // การใช้งานการ์ด "ยกเลิก"
  socket.on("cancel_confirmed", () => {
    const room = getRoomBySocket(socket.id);
    if (!room || !actionStack.length) return;
    const top = actionStack.pop();
  
    const user = room.players.find(p => p.id === socket.id);
    const idx = user.hand.indexOf("ยกเลิก");
    if (idx === -1) return;
  
    user.hand.splice(idx, 1);
    room.discard.push("ยกเลิก");
    io.to(room.id).emit("log", `${user.name} ใช้ ยกเลิก! ขัดขวางการ์ด ${top.card}`);
  });
  
  function executeCardEffect(card, room, player, targetId) {
    if (card === "ดวล") {
      const target = room.players.find(p => p.id === targetId);
      if (!target || target.dead) return;
      room.duel = { attacker: player.id, defender: target.id, turn: player.id };
      io.to(room.id).emit("log", `${player.name} ท้าดวล ${target.name}`);
      io.to(target.id).emit("duel_request", { from: player.name });
      return;
    }
  
    if (card === "ขโมย") {
      const target = room.players.find(p => p.id === targetId);
      if (!target || target.dead) return;
      const attackerIndex = room.players.findIndex(p => p.id === player.id);
      const targetIndex = room.players.findIndex(p => p.id === target.id);
      const distance = getDistance(room.players, attackerIndex, targetIndex);
      const attackRange = getAttackRange(player);
      if (distance > attackRange) return;
      const totalCards = [...target.hand];
      if (target.equipment.weapon) totalCards.push(target.equipment.weapon.name);
      if (target.equipment.armor) totalCards.push(target.equipment.armor.name);
      if (!totalCards.length) return;
      const stolen = totalCards[Math.floor(Math.random() * totalCards.length)];
      player.hand.push(stolen);
      const hIdx = target.hand.indexOf(stolen);
      if (hIdx !== -1) {
        target.hand.splice(hIdx, 1);
      } else {
        if (target.equipment.weapon?.name === stolen) target.equipment.weapon = null;
        if (target.equipment.armor?.name === stolen) target.equipment.armor = null;
      }
      io.to(room.id).emit("log", `${player.name} ขโมยการ์ดจาก ${target.name}`);
      io.to(room.id).emit("players_update", room.players);
      return;
    }
  
    if (card === "มีสุขลืมเมือง") {
      room.players.forEach(p => {
        if (!p.dead) {
          p.hp = Math.min(p.maxHp || 4, p.hp + 1);
        }
      });
      io.to(room.id).emit("log", `${player.name} ใช้ มีสุขลืมเมือง ฟื้นพลังทุกคน`);
      io.to(room.id).emit("players_update", room.players);
      return;
    }
  
    if (card === "เก็บเกี่ยว") {
      const draw = drawCards(room, 5);
      const alive = room.players.filter(p => !p.dead);
      const startIdx = alive.findIndex(p => p.id === player.id);
      for (let i = 0; i < draw.length; i++) {
        const target = alive[(startIdx + i) % alive.length];
        target.hand.push(draw[i]);
        io.to(room.id).emit("log", `${target.name} ได้การ์ดจากเก็บเกี่ยว (${draw[i]})`);
      }
      io.to(room.id).emit("players_update", room.players);
      return;
    }
  
    if (card === "เกาทัณฑ์พันดอก" || card === "เรือระเบิดเพลิง") {
      const needCard = card === "เกาทัณฑ์พันดอก" ? "โจมตี" : "หลบหลีก";
      room.massAction = {
        from: player.id,
        card,
        needCard,
        pending: room.players.filter(p => p.id !== player.id && !p.dead).map(p => p.id)
      };
      room.massAction.pending.forEach(pid => {
        io.to(pid).emit("mass_response", { type: card, need: needCard });
      });
      setTimeout(() => {
        if (!room.massAction) return;
        room.massAction.pending.forEach(pid => handleMassFail(room, pid));
        room.massAction = null;
        io.to(room.id).emit("players_update", room.players);
      }, 8000);
    }
  }
  
  
  
  // ==================== ระบบทักษะขุนศึก ====================
  
  function applyGeneralSkills(room, player, context) {
    const name = player.hero;
    if (player.dead) return;
  
    // ไต้เกี้ยว: ใช้ข้าวหลามตัดแทน 'มีสุขลืมเมือง'
    if (name === "ไต้เกี้ยว" && context.type === "play_card" && context.cardSuit === "♦" && context.cardName !== "มีสุขลืมเมือง") {
      context.override = "มีสุขลืมเมือง";
    }
  
    // ฮัวหยง: ผู้โจมตีเลือกจั่วหรือฟื้น HP เมื่อโจมตีสำเร็จ
    if (name === "ฮัวหยง" && context.type === "attacked" && context.successful) {
      const attacker = room.players.find(p => p.id === context.from);
      if (!attacker) return;
      io.to(attacker.id).emit("huo_yong_choice");
    }
  
    // กุยแก: ได้ไพ่ที่เปิดตอนตัดสิน
    if (name == "กุยแก" && context.type === "judgement_result" && context.cardDrawn) {
      player.hand.push(context.cardDrawn);
      io.to(player.id).emit("log", `ทักษะ กุยแก: ได้ไพ่ตัดสิน (${context.cardDrawn})`);
    }
  
    // เอียนสี: ใช้ไพ่ดำแทนหลบหลีก
    if (name === "เอียนสี" && context.type === "defend" && context.autoUse) {
      const blackCard = player.hand.find(c => getCardColor(c) === "black");
      if (blackCard) {
        player.hand.splice(player.hand.indexOf(blackCard), 1);
        room.discard.push(blackCard);
        context.success = true;
        io.to(room.id).emit("log", `เอียนสี ใช้ไพ่ดำ (${blackCard}) หลบหลีกการโจมตี`);
      }
    }
  
    // สุมาอี้: โต้กลับขโมยการ์ดจากผู้โจมตี
    if (name === "สุมาอี้" && context.type === "attacked" && context.successful) {
      const attacker = room.players.find(p => p.id === context.from);
      if (attacker && attacker.hand.length > 0) {
        const stolen = attacker.hand.pop();
        player.hand.push(stolen);
        io.to(room.id).emit("log", `สุมาอี้ ขโมยการ์ด (${stolen}) จาก ${attacker.name}`);
      }
    }
  
    // จูล่ง: โจมตีแทนหลบ และหลบแทนโจมตี
    if (name === "จูล่ง") {
      if (context.type === "play_card" && context.cardName === "หลบหลีก") {
        context.override = "โจมตี";
      }
      if (context.type === "play_card" && context.cardName === "โจมตี") {
        context.override = "หลบหลีก";
      }
    }
  
    // หวงเย่อิง: ใช้อุบายได้จั่ว
    if (name === "หวงเย่อิง" && context.type === "play_card" && isStrategyCard(context.cardName)) {
      const drawn = drawCards(room, 1);
      player.hand.push(...drawn);
      io.to(player.id).emit("log", `ทักษะ หวงเย่อิง: ได้จั่วไพ่เพิ่ม (${drawn[0]})`);
    }
  
    // ฮัวโต๋: ทิ้ง 1 ใบ ฟื้น HP ให้คนอื่น
    if (name === "ฮัวโต๋" && context.type === "play_card" && context.cardName === "ฟื้นพลัง" && context.from !== context.to) {
      if (player.hand.length > 0) {
        const discarded = player.hand.pop();
        room.discard.push(discarded);
        io.to(room.id).emit("log", `ฮัวโต๋ ใช้ทักษะ ฟื้น HP โดยทิ้งไพ่ ${discarded}`);
      }
    }
  
    // แฮหัวตุ้น: ตัดสินหลังโดนตี
    if (name === "แฮหัวตุ้น" && context.type === "attacked" && context.successful) {
      const suit = randomSuit();
      if (suit !== "♥") {
        const attacker = room.players.find(p => p.id === context.from);
        if (attacker) {
          if (attacker.hand.length >= 2) {
            attacker.hand.splice(0, 2);
            io.to(room.id).emit("log", `${attacker.name} โดนแฮหัวตุ้นตัดสิน → ทิ้ง 2 ใบ`);
          } else {
            attacker.hp -= 1;
            io.to(room.id).emit("log", `${attacker.name} โดนแฮหัวตุ้นตัดสิน → เสีย 1 HP`);
          }
        }
      }
    }
  }
  
  // ตัวช่วย
  function getCardColor(card) {
    const suit = card[0];
    return (suit === "♥" || suit === "♦") ? "red" : "black";
  }
  
  function isStrategyCard(name) {
    return ["ดวล", "ขโมย", "บังคับ", "เกาทัณฑ์พันดอก", "เรือระเบิดเพลิง", "มีสุขลืมเมือง", "เก็บเกี่ยว", "ยกเลิก", "ไฟไหม้", "โซ่ตรวน"].includes(name);
  }
  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


socket.on("disconnect", () => {
    for (const [roomId, room] of Object.entries(rooms)) {
        const idx = room.players.findIndex(p => p.id === socket.id);
        if (idx !== -1) {
            const player = room.players[idx];
            room.players.splice(idx, 1);
            console.log(`${player.name} left room ${roomId}`);
            break;
        }
    }
});
