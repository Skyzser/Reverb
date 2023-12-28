import BufferManager from "./buffer_manager";
class MockBuffer {
  duration;
  constructor(duration) {
    this.duration = duration;
  }
  slice(start, end) {
    if (end === undefined) {
      return new MockBuffer(this.duration - start);
    }
    return new MockBuffer(end - start);
  }
}
// See https://jestjs.io/docs/getting-started on how to make jest tests
describe("bufferSplittingTests", () => {
  let testBuffer;
  beforeEach(async () => {
    testBuffer = new MockBuffer(100);
  });
  it("bufManager splits buffer correctly", async () => {
    let bufManager = new BufferManager(testBuffer);
    bufManager.createSegment(30);
    expect(bufManager.segments.length).toBe(2);
    expect(bufManager.segments[0].threshold).toBe(0);
    expect(bufManager.segments[0].buff.duration).toBe(30);
    expect(bufManager.segments[1].threshold).toBe(30);
    expect(bufManager.segments[1].buff.duration).toBe(70);
  });
});
