type DataUser = {
    name?: string;
    email: string;
    password: string;
};

export type DataUserCreateResponse = {
    id: string;
    email: string;
};

export type DataWord = {
    id: string;
    group: number;
    page: number;
    word: string;
    image: string;
    audio: string;
    audioMeaning: string;
    audioExample: string;
    textMeaning: string;
    textExample: string;
    transcription: string;
    wordTranslate: string;
    textMeaningTranslate: string;
    textExampleTranslate: string;
};

export type DataUserLoginResponse = {
    message: string;
    token: string;
    refreshToken: string;
    userId: string;
    name: string;
};

export type DataUserWord = {
    userId: string;
    wordId: string;
};

export type DataCreateUserWordResponse = {
    id: string;
    difficulty: string;
    optional: {
        testFieldString: 'string';
        testFieldBoolean: boolean;
    };
    wordId: string;
};

class Service {
    private static baseUrl = 'https://learn-english-words-app.herokuapp.com';

    public static async createUser(data: DataUser): Promise<DataUserCreateResponse | undefined> {
        try {
            const response = await fetch(`${this.baseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(data),
            });
            const userData: DataUserCreateResponse = await response.json();
            return userData;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async loginUser(user: DataUser): Promise<DataUserLoginResponse | undefined> {
        try {
            const rawResponse = await fetch(`${this.baseUrl}/signin`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            const loginResponse = await rawResponse.json();
            return loginResponse;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async getWords(group: number, page: number): Promise<DataWord[] | undefined> {
        try {
            const response = await fetch(`${this.baseUrl}/words?group=${group}&page=${page}`);
            const words: DataWord[] = await response.json();
            return words;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async createUserWord(
        wordData: DataUserWord,
        token: string,
        word: object
    ): Promise<DataCreateUserWordResponse | undefined> {
        const { userId, wordId } = wordData;
        try {
            const rawResponse = await fetch(`${this.baseUrl}/users/${userId}/words/${wordId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(word),
            });
            const content = await rawResponse.json();
            return content;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async getUserWords(
        word: DataUserWord,
        token: string
    ): Promise<DataCreateUserWordResponse[] | undefined> {
        const { userId } = word;
        try {
            const rawResponse = await fetch(`${this.baseUrl}/users/${userId}/words`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const content = await rawResponse.json();
            return content;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }
}

export default Service;
