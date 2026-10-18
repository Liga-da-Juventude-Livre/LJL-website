"use client";

import { ConfirmButton } from "@/components/dashboard/client";
import { deleteUser } from "@/modules/users/actions";

export function DeleteUser({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteUser.bind(null, id)}>
      <ConfirmButton title={`Excluir a conta de ${name}?`} message="A pessoa perde o acesso agora e a conta não pode ser recuperada. O que ela escreveu continua publicado com o nome dela." confirmLabel="Excluir conta">
        Excluir conta
      </ConfirmButton>
    </form>
  );
}
