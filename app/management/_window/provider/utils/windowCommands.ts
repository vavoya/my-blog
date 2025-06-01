import {WindowObj} from "@/app/management/_window/provider/types";

export type WindowCommands = {
    add?: WindowObj[];
    remove?: WindowObj['id'][];
    rename?: {[key: WindowObj['id']]: WindowObj['name']};
    update?: WindowObj[];
    reset?: boolean;   // 전체 초기화를 원할 때 true
};


export class WindowCommandBuilder {
    private windowCommands: WindowCommands;

    constructor() {
        this.windowCommands = {}
    }

    add(windowObjs: WindowObj[]) {
        // 중복 요소는 기존 객체를 위로 올리는 방식
        this.windowCommands.add = windowObjs;
        return this;
    }

    remove(windowNames: WindowObj['id'][]) {
        this.windowCommands.remove = windowNames;
        return this;
    }

    rename(windowNames: {[key: WindowObj['id']]: WindowObj['name']}) {
        this.windowCommands.rename = windowNames;
        return this;
    }

    update(windowObjs: WindowObj[]) {
        // 중복 요소는 새 객체로 교체하여 올리는 방식
        this.windowCommands.update = windowObjs;
        return this;
    }

    reset() {
        this.windowCommands.reset = true;
        return this;
    }

    returnCommand() {
        return this.windowCommands;
    }
}
