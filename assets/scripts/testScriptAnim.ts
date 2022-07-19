import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TestScriptAnim
 * DateTime = Tue Jul 19 2022 20:48:05 GMT+0700 (Indochina Time)
 * Author = romandrampc
 * FileBasename = testScriptAnim.ts
 * FileBasenameNoExtension = testScriptAnim
 * URL = db://assets/scripts/testScriptAnim.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('TestScriptAnim')
export class TestScriptAnim extends Component {
  onAnimComplete = (pa: string) => {
    console.log(pa);
  };
}
