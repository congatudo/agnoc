import { expect } from "chai";
import execa, { ExecaError } from "execa";
import { describe, it } from "mocha";

describe("cli", function () {
  this.timeout(5000);

  it("displays help by default", async () => {
    try {
      await execa("node", ["./bin/agnoc"]);
    } catch (e) {
      expect((e as ExecaError).stderr).to.include("Usage: agnoc");
    }
  });

  it("has a decode command", async () => {
    const { stdout } = await execa("node", ["bin/agnoc", "decode", "-h"]);

    expect(stdout).to.include("Usage: agnoc decode");
  });

  it("has a encode command", async () => {
    const { stdout } = await execa("node", ["bin/agnoc", "encode", "-h"]);

    expect(stdout).to.include("Usage: agnoc encode");
  });
});
