// ethan-test.ts
// 这个文件只用于你（Ethan）的独立测试

import Konva from 'konva';
import { STAGE_WIDTH, STAGE_HEIGHT } from './src/constants.ts'; // 导入常量

// 导入你写的两个弹窗组件！
import { CardDetailsPopup } from './src/screens/CardsScreen/CardDetailsPopup.ts';
import { TutorialPlayerPopup } from './src/screens/CardsScreen/TutorialPlayerPopup.ts';
import type { Card } from './src/types.ts';

// --- 1. 准备“假数据” (Mock Data) ---

const MOCK_UNLOCKED_CARD: Card = {
  id: 'c001',
  name: 'Fire Knight',
  description: 'A brave knight that wields a flaming sword. Deals extra damage to ice units.',
  cost: 4,
  imageUrl: 'https://via.placeholder.com/360x200.png?text=Fire+Knight+Art', // 使用一个在线占位图
  is_locked: false,
  tutorial_path: ''
};

const MOCK_LOCKED_CARD: Card = {
  id: 'c002',
  name: 'Ice Dragon',
  description: '',
  cost: 7,
  imageUrl: '',
  is_locked: true,
  // 假设教程是一个图片
  tutorial_path: '\menu_images\tutorial.jpg'
};


// --- 2. 初始化 Konva 环境 ---

// 创建 Konva 舞台 (Stage)
const stage = new Konva.Stage({
  container: 'konva-container', // 绑定到 HTML 里的 <div>
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
});

// 创建一个主图层 (Layer)
const mainLayer = new Konva.Layer();
stage.add(mainLayer);

// --- 3. 实例化你的组件 ---

console.log('正在实例化 Ethan 的弹窗...');
const detailsPopup = new CardDetailsPopup();
const tutorialPopup = new TutorialPlayerPopup();

// --- 4. 把你的组件添加到图层中 ---
// Huerter 的 CardsScreenView 之后也会做同样的事
mainLayer.add(detailsPopup.getGroup());
mainLayer.add(tutorialPopup.getGroup());

// 第一次绘制画布
mainLayer.draw();

console.log('测试平台准备就绪。请点击按钮。');

// --- 5. 绑定 HTML 按钮的点击事件 ---

document.getElementById('test-details-btn')!.addEventListener('click', () => {
  console.log('测试“详情”弹窗...');
  // 调用你写的 show() 方法！
  detailsPopup.show(MOCK_UNLOCKED_CARD);
  // Huerter 和 Controller 之后也会这样做
  mainLayer.draw();
});

document.getElementById('test-tutorial-btn')!.addEventListener('click', () => {
  console.log('测试“教程”弹窗...');
  // 调用你写的 show() 方法！
  tutorialPopup.show(MOCK_LOCKED_CARD.tutorial_path);
  mainLayer.draw();
});