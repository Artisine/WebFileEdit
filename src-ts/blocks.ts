
class Block {
	static RunningCount = 1;

	ClassName: string;
	Id: number;
	Position?: number;

	constructor() {
		this.ClassName = "Block";
		this.Id = Block.RunningCount++;
		this.Position = undefined;
		
	}
}

class TextBlock extends Block {

	Text: string;
	constructor() {
		super();
		this.ClassName = "TextBlock";
		this.Text = ``;
	}
}

export {Block, TextBlock};


// "End of File";