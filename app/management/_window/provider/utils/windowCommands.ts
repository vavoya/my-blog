import {WindowObj} from "@/app/management/_window/provider/types";

/**
 * 윈도우 명령어 타입
 */
export type WindowCommands = {
    /** 윈도우를 추가하는 명령어 */
    add?: WindowObj[];
    /** 윈도우를 삭제하는 명령어 */
    remove?: WindowObj['id'][];
    /** 윈도우 이름을 변경하는 명령어 */
    rename?: { [key: WindowObj['id']]: WindowObj['name'] };
    /** 윈도우를 업데이트하는 명령어 */
    update?: WindowObj[];
    /** 전체 초기화를 원할 때 true */
    reset?: boolean;
};

/**
 * 윈도우 명령어를 생성하는 빌더 클래스
 */
export class WindowCommandBuilder {
    /** 윈도우 명령어 객체 */
    private windowCommands: WindowCommands;

    /**
     * 생성자
     */
    constructor() {
        this.windowCommands = {}
    }

    /**
     * 윈도우를 추가하는 메서드
     * 중복 요소는 기존 객체를 위로 올리는 방식
     * @param windowObjs - 추가할 윈도우 객체 배열
     */
    add(windowObjs: WindowObj[]) {
        this.windowCommands.add = windowObjs;
        return this;
    }

    /**
     * 윈도우를 삭제하는 메서드
     * @param windowNames - 삭제할 윈도우 ID 배열
     */
    remove(windowNames: WindowObj['id'][]) {
        this.windowCommands.remove = windowNames;
        return this;
    }

    /**
     * 윈도우 이름을 변경하는 메서드
     * @param windowNames - 변경할 윈도우 ID와 새 이름 매핑 객체
     */
    rename(windowNames: { [key: WindowObj['id']]: WindowObj['name'] }) {
        this.windowCommands.rename = windowNames;
        return this;
    }

    /**
     * 윈도우를 업데이트하는 메서드
     * 중복 요소는 새 객체로 교체하여 올리는 방식
     * @param windowObjs - 업데이트할 윈도우 객체 배열
     */
    update(windowObjs: WindowObj[]) {
        this.windowCommands.update = windowObjs;
        return this;
    }

    /**
     * 모든 윈도우를 초기화하는 메서드
     */
    reset() {
        this.windowCommands.reset = true;
        return this;
    }

    /**
     * 생성된 명령어를 반환하는 메서드
     */
    returnCommand() {
        return this.windowCommands;
    }
}