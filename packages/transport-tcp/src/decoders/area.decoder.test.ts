import { expect } from 'chai';
import { decodeArea } from './area.decoder';

describe('decodeArea', function () {
  it('should decode an empty area', function () {
    const buffer = Buffer.from('789c63606060000000040001', 'hex');
    const areaListInfo = decodeArea(buffer);

    expect(areaListInfo).to.be.deep.equal({ count: 0 });
  });

  it('should decode an area with one area', function () {
    const buffer = Buffer.from(
      '789c4dcdcb1180300804d0c5ffbf256329b91bcd58414ab114edcc45397878330cb0200032caa9a092c46406386fb37c306bb77a67905af3c1c7c6726d71ec7b60753abaa4d3db71f55bcf62b0a5f1f708487a90db8e92a69cf62779003fff0f4c',
      'hex',
    );
    const areaListInfo = decodeArea(buffer);

    expect(areaListInfo).to.be.deep.equal({
      count: 1,
      mapHeadId: 2,
      unk2: [{ unk1: 3, unk2: 4 }],
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
    });
  });
});
