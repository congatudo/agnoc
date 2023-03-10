import { ArgumentOutOfRangeException, DomainException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { decodeMap } from './map.decoder';

describe('decodeMap', function () {
  it('should throw an error when mask is out of range', function () {
    const buffer = Buffer.from('789c63686060000001840081', 'hex');

    expect(() => decodeMap(buffer)).to.throw(
      ArgumentOutOfRangeException,
      `Value '32768' for property 'mask' of MapInfo is out of range [0, 32767]`,
    );
  });

  it('should throw an error when there are bytes left after decoding the map', function () {
    const buffer = Buffer.from('789c63606060606462660100001c000b', 'hex');

    console.log(buffer.toString('hex'));

    expect(() => decodeMap(buffer)).to.throw(
      DomainException,
      `Data left on stream after decoding MapInfo: 000001020304`,
    );
  });

  it('should do nothing with an empty mask', function () {
    const buffer = Buffer.from('789c63606060000000040001', 'hex');
    const mapInfo = decodeMap(buffer);

    expect(mapInfo).to.be.deep.equal({ mask: 0 });
  });

  it('should decode a map', function () {
    const buffer = Buffer.from(
      '789c9d914d12c23008851f26d6fa7ba5d2a374c6a5b51d572e7b941ea59e4c41c824ba53665e86848f10c8f30e104c2bd1d9fd208aa2b5ef2bd1a6d8275e05cc0f576b42832f46ee9b58821c750116a67726c467d660a22967c098a9312edb3f6caaa3f58bfc7c5839af6d86be1b6b4fdec6db30f464ef9e17dae968c64b77dd8b7370e858cc25bfe2b3e28928233f59d96f907fa117b0791cb1',
      'hex',
    );
    const mapInfo = decodeMap(buffer);

    expect(mapInfo).to.be.deep.equal({
      mask: 30975,
      statusInfo: {
        mapHeadId: 1,
        hasHistoryMap: true,
        workingMode: 2,
        batteryPercent: 100,
        chargeState: true,
        faultType: 3,
        faultCode: 4,
        cleanPreference: 5,
        repeatClean: true,
        cleanTime: 6,
        cleanSize: 7,
      },
      mapHeadInfo: {
        mapHeadId: 5,
        mapValid: 1,
        mapType: 1,
        sizeX: 2,
        sizeY: 2,
        minX: -20,
        minY: -20,
        maxX: 20,
        maxY: 20,
        resolution: 0.5,
      },
      mapGrid: Buffer.from([0, 0, 0, 0]),
      historyHeadInfo: {
        mapHeadId: 1,
        poseId: 2,
        pointNumber: 2,
        pointList: [
          { flag: 3, x: 4, y: 5 },
          { flag: 4, x: 5, y: 6 },
        ],
      },
      robotChargeInfo: { mapHeadId: 1, poseX: 2, poseY: 3, posePhi: 4 },
      wallListInfo: {
        mapHeadId: 1,
        cleanPlanId: 2,
        cleanAreaList: [{ cleanAreaId: 2, cleanPlanId: 3, coordinateList: [{ x: 1, y: 2 }] }],
      },
      areaListInfo: {
        mapHeadId: 1,
        cleanPlanId: 2,
        cleanAreaList: [{ cleanAreaId: 2, cleanPlanId: 3, coordinateList: [{ x: 1, y: 2 }] }],
      },
      spotInfo: { mapHeadId: 1, ctrlValue: 2, poseX: 3, poseY: 4, posePhi: 5 },
      robotPoseInfo: { mapHeadId: 1, poseId: 2, update: 1, poseX: 3, poseY: 4, posePhi: 5 },
      cleanPlanInfo: { mapHeadId: 6, mask: 0, firstCleanFlag: 0 },
      mapInfoList: [{ mapHeadId: 7, mapName: 'map' }],
      currentPlanId: 8,
      cleanRoomList: [{ roomId: 9, roomName: 'room', roomState: 1, roomX: 5, roomY: -5 }],
      cleanPlanList: [
        {
          planId: 10,
          planName: 'plan',
          mapHeadId: 11,
          currentPlanId: 12,
          areaInfoList: [{ areaId: 13, areaType: 1, points: 1, x: [1], y: [2], unk1: [3], unk2: [4], unk3: [5] }],
          cleanRoomInfoList: [{ roomId: 14, enable: 1 }],
        },
      ],
      roomConnectionList: [{ roomId: 9, connectionList: [9] }],
      roomEnableInfo: { mapHeadId: 1, size: 1 },
      unk1: Buffer.from([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
      roomSegmentList: [{ roomId: 2, roomPixelList: [{ x: 3, y: 4, mask: 1 }] }],
    });
  });

  it('should decode a map without are info points', function () {
    const buffer = Buffer.from(
      '789c6390606060630003467620c19c9b58c001e20031274b517e7e2e90b5c001880f307201c5580a7212f3b8810c1ea8225e28cd00a5f918190060f8076c',
      'hex',
    );
    const mapInfo = decodeMap(buffer);

    expect(mapInfo).to.be.deep.equal({
      mask: 6144,
      cleanPlanInfo: { mapHeadId: 6, mask: 0, firstCleanFlag: 0 },
      mapInfoList: [{ mapHeadId: 7, mapName: 'map' }],
      currentPlanId: 8,
      cleanRoomList: [{ roomId: 9, roomName: 'room', roomState: 1, roomX: 5, roomY: -5 }],
      cleanPlanList: [
        {
          planId: 10,
          planName: 'plan',
          mapHeadId: 11,
          currentPlanId: 12,
          areaInfoList: [{ areaId: 13, areaType: 1, points: 0 }],
          cleanRoomInfoList: [{ roomId: 14, enable: 1 }],
        },
      ],
      roomConnectionList: [{ roomId: 9, connectionList: [] }],
    });
  });

  it('should try to read mask as a short type', function () {
    const buffer = Buffer.from('789c6364606460006326204e81b2998198058859a17c3620660762000ed40085', 'hex');
    const mapInfo = decodeMap(buffer);

    expect(mapInfo).to.be.deep.equal({
      mask: 1,
      statusInfo: {
        mapHeadId: 1,
        hasHistoryMap: true,
        workingMode: 2,
        batteryPercent: 100,
        chargeState: true,
        faultType: 3,
        faultCode: 4,
        cleanPreference: 5,
        repeatClean: true,
        cleanTime: 6,
        cleanSize: 7,
      },
    });
  });
});

// function getBuffer() {
//   const stream = new BufferWriter();

//   // mask
//   writeShort(stream, 0x1);

//   // statusInfo 0x1
//   writeWord(stream, 1);
//   writeWord(stream, 1);
//   writeWord(stream, 2);
//   writeWord(stream, 100);
//   writeWord(stream, 1);
//   writeWord(stream, 3);
//   writeWord(stream, 4);
//   writeWord(stream, 5);
//   writeWord(stream, 1);
//   writeWord(stream, 6);
//   writeWord(stream, 7);

//   // // mapHeadInfo 0x2
//   // writeWord(stream, 5);
//   // writeWord(stream, 1);
//   // writeWord(stream, 1);
//   // writeWord(stream, 2);
//   // writeWord(stream, 2);
//   // writeFloat(stream, -20);
//   // writeFloat(stream, -20);
//   // writeFloat(stream, 20);
//   // writeFloat(stream, 20);
//   // writeFloat(stream, 0.5);

//   // // grid
//   // for (let i = 0; i < 2 * 2; i++) {
//   //   writeByte(stream, 0);
//   // }

//   // // historyHeadInfo 0x4
//   // writeWord(stream, 1);
//   // writeWord(stream, 2);
//   // writeWord(stream, 2);

//   // for (let i = 0; i < 2; i++) {
//   //   writeByte(stream, 3 + i);
//   //   writeFloat(stream, 4 + i);
//   //   writeFloat(stream, 5 + i);
//   // }

//   // // robotChargeInfo 0x8
//   // writeWord(stream, 1);
//   // writeFloat(stream, 2);
//   // writeFloat(stream, 3);
//   // writeFloat(stream, 4);

//   // // wallListInof 0x10
//   // writeWord(stream, 1);
//   // writeWord(stream, 2);
//   // writeWord(stream, 1);
//   // writeWord(stream, 2);
//   // writeWord(stream, 3);
//   // writeWord(stream, 1);
//   // writeFloat(stream, 1);
//   // writeFloat(stream, 2);

//   // for (let i = 0; i < 3 * 4; i++) {
//   //   writeByte(stream, 0);
//   // }

//   // // areaListInfo 0x20
//   // writeWord(stream, 1);
//   // writeWord(stream, 2);
//   // writeWord(stream, 1);
//   // writeWord(stream, 2);
//   // writeWord(stream, 3);
//   // writeWord(stream, 1);
//   // writeFloat(stream, 1);
//   // writeFloat(stream, 2);

//   // for (let i = 0; i < 3 * 4; i++) {
//   //   writeByte(stream, 0);
//   // }

//   // // spotInfo 0x40
//   // writeWord(stream, 1);
//   // writeWord(stream, 2);
//   // writeFloat(stream, 3);
//   // writeFloat(stream, 4);
//   // writeFloat(stream, 5);

//   // // robotPoseInfo 0x80
//   // writeWord(stream, 1);
//   // writeWord(stream, 2);
//   // writeByte(stream, 1);
//   // writeFloat(stream, 3);
//   // writeFloat(stream, 4);
//   // writeFloat(stream, 5);

//   // // plan & rooms 0x800
//   // // cleanPlanInfo
//   // writeWord(stream, 6);
//   // writeShort(stream, 0);
//   // writeByte(stream, 0);
//   // // mapInfoList
//   // writeByte(stream, 1);
//   // writeWord(stream, 7);
//   // writeString(stream, 'map');
//   // // currentPlanId
//   // writeWord(stream, 8);
//   // // cleanRoomList
//   // writeWord(stream, 1);
//   // writeByte(stream, 9);
//   // writeString(stream, 'room');
//   // writeByte(stream, 1);
//   // writeFloat(stream, 5);
//   // writeFloat(stream, -5);
//   // // cleanPlanList
//   // writeByte(stream, 1);
//   // writeWord(stream, 10);
//   // writeString(stream, 'plan');
//   // writeWord(stream, 11);
//   // writeWord(stream, 12);
//   // writeWord(stream, 1);
//   // writeWord(stream, 13);
//   // writeWord(stream, 1);
//   // writeWord(stream, 0);
//   // writeWord(stream, 1);
//   // writeByte(stream, 14);
//   // writeByte(stream, 1);

//   // // roomConnectionList 0x1000
//   // writeByte(stream, 0);

//   // // roomEnableInfo 0x2000
//   // writeWord(stream, 1);
//   // writeByte(stream, 1);

//   // for (let i = 0; i < 50; i++) {
//   //   writeByte(stream, 0);
//   // }

//   // // roomSegmentList 0x4000
//   // writeWord(stream, 1);
//   // writeWord(stream, 2);
//   // writeWord(stream, 1);
//   // writeShort(stream, 3);
//   // writeShort(stream, 4);
//   // writeByte(stream, 1);

//   return deflateSync(stream.buffer);
// }
