interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

import Image from "next/image";

import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImage from "../assets/users-avatar-example.png";
import iconCheckImage from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso! O código foi copiado para a área de transferência"
      );

      setPoolTitle("");
    } catch (error) {
      alert("Falha ao criar o bolão tente novamente.");
    }
  }

  return (
    <div className="grid grid-cols-2 items-center h-screen mx-auto max-w-6xl gap-6">
      <main>
        <Image src={logoImg} alt="nwl copa" quality={100} />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu própio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImage} alt="" quality={100} />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão utilizando.
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 gap-2 flex">
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-white"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 rounded px-6 py-4
             text-gray-900 text-sm font-bold uppercase hover:bg-yellow-700"
          >
            Crie seu bolão
          </button>
        </form>

        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você recebera um código único que porderá usar
          para convidar outras pessoas
        </p>

        <div
          className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between
         text-gray-100"
        >
          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />
            <div className="flex flex-col">
              <span className="text-bold text-2xl ">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />
            <div className="flex flex-col">
              <span className="text-bold text-2xl ">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImage}
        alt="Imagem telefones mostrando a aplicação"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, usersCountResponse] =
    await Promise.all([
      api.get("http://localhost:3333/pools/count"),
      api.get("http://localhost:3333/guesses/count"),
      api.get("http://localhost:3333/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: usersCountResponse.data.count,
    },
  };
};
