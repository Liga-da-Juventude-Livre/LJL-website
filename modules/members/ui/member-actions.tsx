"use client";

import { ConfirmButton } from "@/components/dashboard/client";
import { deleteMembership, endMembership, reactivateMembership } from "@/modules/members/actions";

export function MemberActions({ id, active }: { id: string; active: boolean }) {
  return (
    <div className="dash-form-actions">
      {active ? (
        <form action={endMembership.bind(null, id)}>
          <ConfirmButton message="Encerrar o mandato? A pessoa passa a ser alumni e perde o acesso de edição.">Encerrar mandato (virar alumni)</ConfirmButton>
        </form>
      ) : (
        <form action={reactivateMembership.bind(null, id)}>
          <ConfirmButton message="Reativar esta pessoa como membro?">Reativar como membro</ConfirmButton>
        </form>
      )}
      <form action={deleteMembership.bind(null, id)}>
        <ConfirmButton message="Excluir este registro e os dados da pessoa? Isso não pode ser desfeito.">Excluir registro e dados</ConfirmButton>
      </form>
    </div>
  );
}
